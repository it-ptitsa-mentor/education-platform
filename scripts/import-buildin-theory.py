#!/usr/bin/env python3
"""
Импорт теории из Buildin (курс «АйТи Птица. Программа обучения JS Разработчик»)
в репозиторий как markdown — SSOT для теории.

Структура источника:  курс → Модуль 1..6 (child_page) → тема (child_database)
                       → урок (строка БД, тело страницы = markdown-теория)

Результат: content/theory/<NN-module>/<MM-topic>/<KK-lesson>.md  + manifest.json

Запуск:  BUILDIN_MCP_TOKEN=... python3 scripts/import-buildin-theory.py
"""
import os, re, json, time, sys, pathlib, urllib.request, urllib.error

TOKEN = os.environ["BUILDIN_MCP_TOKEN"]
BASE = "https://api.buildin.ai/v1"
COURSE_ID = "2427ffcb-409b-463a-bfc0-01f0be591a9a"
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "content" / "theory"

# Модули, переписанные в репозитории — не перезаписывать при импорте из Buildin.
FROZEN_MODULES = {"01-modul-1", "02-modul-2"}

# ── HTTP с ретраями (REST иногда отдаёт 502/500) ──
def _req(method, path, body=None, retries=5):
    url = f"{BASE}{path}"
    data = json.dumps(body).encode() if body is not None else None
    for attempt in range(retries):
        req = urllib.request.Request(url, data=data, method=method)
        req.add_header("Authorization", f"Bearer {TOKEN}")
        req.add_header("Content-Type", "application/json")
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                payload = json.loads(r.read().decode())
            if isinstance(payload, dict) and payload.get("code") in (500, 502):
                raise RuntimeError(payload.get("msg", "server error"))
            return payload
        except (urllib.error.HTTPError, urllib.error.URLError, RuntimeError, TimeoutError) as e:
            if attempt == retries - 1:
                raise
            time.sleep(1.2 * (attempt + 1))
    raise RuntimeError("unreachable")

def children(block_id):
    out, cursor = [], None
    while True:
        q = f"/blocks/{block_id}/children?page_size=100" + (f"&start_cursor={cursor}" if cursor else "")
        d = _req("GET", q)
        out += d.get("results", [])
        if not d.get("has_more"):
            break
        cursor = d.get("next_cursor")
    return out

def get_database(db_id):
    d = _req("GET", f"/databases/{db_id}")
    title = "".join(t.get("plain_text", "") for t in d.get("title", []))
    return title.strip()

# Модули берём жёстко по id (REST дропает Модуль 2 из списка детей курса и
# не отдаёт заголовки child_page — источник истины MCP getBlockChildren).
MODULES = [
    ("1646b412-6bff-487c-984e-e4de4fcc0543", "Модуль 1"),
    ("2eb2010e-c9c9-44f5-9324-f5b47a068c12", "Модуль 2"),
    ("8152e7ea-ef99-4f8b-9f58-0384bd94338d", "Модуль 3"),
    ("4344642c-62fe-46b8-a21b-05ba51b842f4", "Модуль 4"),
    ("b15f27ac-ef3e-4dc0-8ceb-7194639e755e", "Модуль 5"),
    ("71dd7ef8-b260-4e12-b6ae-f40929d2ebb9", "Модуль 6"),
]

def query_db(db_id):
    out, cursor = [], None
    while True:
        body = {"page_size": 100}
        if cursor:
            body["start_cursor"] = cursor
        d = _req("POST", f"/databases/{db_id}/query", body)
        out += d.get("results", [])
        if not d.get("has_more"):
            break
        cursor = d.get("next_cursor")
    return out

# ── rich_text → markdown ──
def rich(rt):
    s = ""
    for t in rt or []:
        txt = t.get("plain_text", t.get("text", {}).get("content", ""))
        a = t.get("annotations", {})
        if a.get("code"):
            txt = f"`{txt}`"
        if a.get("bold"):
            txt = f"**{txt}**"
        if a.get("italic"):
            txt = f"*{txt}*"
        if a.get("strikethrough"):
            txt = f"~~{txt}~~"
        href = t.get("href") or (t.get("text", {}).get("link") or {} if isinstance(t.get("text", {}).get("link"), dict) else None)
        if isinstance(href, str):
            txt = f"[{txt}]({href})"
        s += txt
    return s

LANG = {"plain text": "", "plaintext": "", "javascript": "javascript", "js": "javascript",
        "typescript": "typescript", "ts": "typescript", "html": "html", "css": "css",
        "json": "json", "bash": "bash", "shell": "bash", "markdown": "markdown"}

# ── блоки → markdown (рекурсивно) ──
def blocks_to_md(block_id, depth=0):
    lines = []
    for b in children(block_id):
        t = b.get("type")
        data = b.get("data") or b.get(t, {})  # REST кладёт контент в "data"
        rt = data.get("rich_text", [])
        ind = "  " * depth
        if t == "paragraph":
            if rt:
                lines.append(ind + rich(rt))
                lines.append("")
        elif t in ("heading_1", "heading_2", "heading_3"):
            hashes = {"heading_1": "#", "heading_2": "##", "heading_3": "###"}[t]
            lines.append(f"{hashes} {rich(rt)}")
        elif t == "bulleted_list_item":
            lines.append(f"{ind}- {rich(rt)}")
            if b.get("has_children"):
                lines += blocks_to_md(b["id"], depth + 1)
            if depth == 0:
                lines.append("")
        elif t == "numbered_list_item":
            lines.append(f"{ind}1. {rich(rt)}")
            if b.get("has_children"):
                lines += blocks_to_md(b["id"], depth + 1)
            if depth == 0:
                lines.append("")
        elif t == "to_do":
            mark = "x" if data.get("checked") else " "
            lines.append(f"{ind}- [{mark}] {rich(rt)}")
            if depth == 0:
                lines.append("")
        elif t == "code":
            lang = LANG.get((data.get("language") or "").lower().strip(), "")
            lines.append(f"```{lang}\n{rich(rt)}\n```")
        elif t == "quote":
            lines.append(f"> {rich(rt)}")
        elif t == "callout":
            icon = (data.get("icon") or {}).get("emoji", "💡")
            lines.append(f"> {icon} {rich(rt)}")
        elif t == "divider":
            lines.append("---")
        elif t in ("image", "file"):
            cap = rich(data.get("caption", []))
            lines.append(f"<!-- IMG{': ' + cap if cap else ''} (из Buildin, перезалить отдельно) -->")
        elif t == "table":
            if b.get("has_children"):
                lines += table_to_md(b["id"])
        elif t == "toggle":
            lines.append(f"<details><summary>{rich(rt)}</summary>\n")
            if b.get("has_children"):
                lines += blocks_to_md(b["id"], depth)
            lines.append("</details>")
        elif t == "column_list" or t == "column":
            if b.get("has_children"):
                lines += blocks_to_md(b["id"], depth)
        # пустые/неизвестные — пропускаем
        if t in ("heading_1", "heading_2", "heading_3", "code", "quote", "callout", "divider", "table"):
            lines.append("")
    return lines

def table_to_md(table_id):
    rows = children(table_id)
    md = []
    for i, r in enumerate(rows):
        cells = r.get("table_row", {}).get("cells", [])
        md.append("| " + " | ".join(rich(c) for c in cells) + " |")
        if i == 0:
            md.append("| " + " | ".join("---" for _ in cells) + " |")
    return md

# ── slug ──
TR = str.maketrans({
 'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y',
 'к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f',
 'х':'h','ц':'c','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'})
def slug(s):
    s = (s or "").strip().lower().translate(TR)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s or "untitled"

def title_of(page):
    props = page.get("properties", {})
    for p in props.values():
        if p.get("type") == "title":
            return rich(p.get("title", [])).strip()
    return ""

# ── основной обход ──
def main():
    import shutil

    frozen_manifest_mods = {}
    tmp = OUT.parent / ".theory-frozen-backup"
    if OUT.exists() and FROZEN_MODULES:
        manifest_path = OUT / "manifest.json"
        if manifest_path.exists():
            old_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
            for m in old_manifest.get("modules", []):
                if m.get("slug") in FROZEN_MODULES:
                    frozen_manifest_mods[m["slug"]] = m
        backed = []
        if tmp.exists():
            shutil.rmtree(tmp)
        tmp.mkdir(parents=True)
        for mslug in FROZEN_MODULES:
            src = OUT / mslug
            if src.is_dir():
                shutil.copytree(src, tmp / mslug)
                backed.append(mslug)
        if backed:
            print(f"🔒 Бэкап замороженных модулей: {', '.join(sorted(backed))}")

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)

    if tmp.exists() and any((tmp / mslug).is_dir() for mslug in FROZEN_MODULES):
        for mslug in FROZEN_MODULES:
            src = tmp / mslug
            if src.is_dir():
                shutil.copytree(src, OUT / mslug)
        shutil.rmtree(tmp)
        print("   ↳ локальные версии модулей восстановлены")

    manifest = {"course": "JS Разработчик", "course_id": COURSE_ID, "modules": []}
    lesson_count = topic_count = 0

    skipped = []
    for mi, (mid, mtitle) in enumerate(MODULES, 1):
        mslug = f"{mi:02d}-modul-{mi}"
        mdir = OUT / mslug
        mrec = {"index": mi, "title": mtitle, "id": mid, "slug": mslug, "topics": []}
        print(f"\n📦 {mtitle}")

        if mslug in FROZEN_MODULES and mslug in frozen_manifest_mods:
            print("  🔒 модуль заморожен — импорт из Buildin пропущен")
            manifest["modules"].append(frozen_manifest_mods[mslug])
            for t in frozen_manifest_mods[mslug].get("topics", []):
                topic_count += 1
                lesson_count += len(t.get("lessons", []))
            continue

        if mslug in FROZEN_MODULES and mdir.is_dir():
            print("  🔒 модуль заморожен — есть локальные файлы, импорт пропущен")
            manifest["modules"].append(mrec)
            continue

        try:
            topic_blocks = [b for b in children(mid) if b.get("type") == "child_database"]
        except urllib.error.HTTPError as e:
            if e.code == 403:
                print(f"  ⚠️  НЕТ ДОСТУПА (403) — пропускаю модуль")
                skipped.append(mtitle)
                manifest["modules"].append(mrec)
                continue
            raise
        for ti, tp in enumerate(topic_blocks, 1):
            ttitle = get_database(tp["id"]) or (tp.get("child_database", {}).get("title") or "").strip()
            tslug = f"{ti:02d}-{slug(ttitle)}"
            tdir = mdir / tslug
            tdir.mkdir(parents=True, exist_ok=True)
            topic_count += 1
            trec = {"index": ti, "title": ttitle, "id": tp["id"], "slug": tslug, "lessons": []}
            print(f"  📚 {ttitle}")

            # сортировка уроков: по числовому префиксу «N.» если есть,
            # иначе — в порядке БД; префикс срезаем (чистый заголовок лучше
            # матчится с заданиями, у которых lessonName без номера)
            raw = []
            for qi, lp in enumerate(query_db(tp["id"])):
                tt = title_of(lp)
                if tt:
                    raw.append((tt, lp, qi))

            def _skey(x):
                m = re.match(r"^\s*(\d+)[.)]\s*", x[0])
                return (0, int(m.group(1))) if m else (1, x[2])

            raw.sort(key=_skey)

            li = 0
            for ltitle_raw, lp, _qi in raw:
                ltitle = re.sub(r"^\s*\d+[.)]\s*", "", ltitle_raw).strip()
                if not ltitle:
                    continue
                li += 1
                lslug = f"{li:02d}-{slug(ltitle)}"
                body = "\n".join(blocks_to_md(lp["id"]))
                body = re.sub(r"\n{3,}", "\n\n", body).strip()
                fm = (f"---\ntitle: {json.dumps(ltitle, ensure_ascii=False)}\n"
                      f"module: {json.dumps(mtitle, ensure_ascii=False)}\n"
                      f"topic: {json.dumps(ttitle, ensure_ascii=False)}\n"
                      f"buildin_id: {lp['id']}\n---\n\n")
                (tdir / f"{lslug}.md").write_text(fm + f"# {ltitle}\n\n" + body + "\n", encoding="utf-8")
                trec["lessons"].append({"index": li, "title": ltitle, "id": lp["id"], "slug": lslug})
                lesson_count += 1
                print(f"     ✓ {ltitle}")
                time.sleep(0.05)
            mrec["topics"].append(trec)
        manifest["modules"].append(mrec)

    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n✅ Готово: модулей {len(MODULES) - len(skipped)}/{len(MODULES)}, тем {topic_count}, уроков {lesson_count}")
    if skipped:
        print(f"   ⚠️  пропущено (нет доступа боту): {', '.join(skipped)}")
    print(f"   → {OUT}")

if __name__ == "__main__":
    main()
