#!/usr/bin/env python3
"""
Связка теория ↔ практика ↔ квиз на уровне УРОКА.

Источники:
  content/theory/manifest.json   — модули → темы → уроки (теория)
  exercises/*/exercise.json       — задания (hexlet.courseSlug/lessonName)
  quizzes/*/quiz.json             — квизы   (hexlet.courseSlug/lessonName)

Результат: content/course.json — единая модель курса:
  курс → модуль → тема(courseSlug) → урок { theory, quiz, exercise }

Запуск: python3 scripts/build-course-model.py
"""
import json, glob, os, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
THEORY = ROOT / "content" / "theory"

def norm(s):
    s = (s or "").strip().lower().replace("ё", "е")
    return re.sub(r"\s+", " ", s)

# тема теории (title) → courseSlug заданий. Авто-матч по courseName + алиасы.
ALIAS = {
    "css: позиционирование элементов": "css-positioning",
    "объектно-ориентированный дизайн": "js-object-oriented-design",
    # темы без практики (концептуальные) — courseSlug = None
    "js: настройка окружения": None,
    "непрерывная интеграция (ci)": None,
}

def main():
    man = json.load(open(THEORY / "manifest.json", encoding="utf-8"))

    # courseName(norm) → courseSlug ; и индекс заданий/квизов по (courseSlug, lessonName)
    name2slug = {}
    ex_idx = {}    # (courseSlug, norm lessonName) -> exercise slug
    for f in glob.glob(str(ROOT / "exercises/*/exercise.json")):
        d = json.load(open(f, encoding="utf-8")); h = d.get("hexlet", {})
        cs = h.get("courseSlug"); cn = h.get("courseName")
        if cn: name2slug[norm(cn)] = cs
        if cs and h.get("lessonName"):
            ex_idx[(cs, norm(h["lessonName"]))] = d.get("slug")

    quiz_idx = {}  # (courseSlug, norm lessonName) -> quiz slug
    quiz_count = {}
    for f in glob.glob(str(ROOT / "quizzes/*/quiz.json")):
        q = json.load(open(f, encoding="utf-8")); h = q.get("hexlet", {})
        cs = h.get("courseSlug")
        if cs and h.get("lessonName"):
            quiz_idx[(cs, norm(h["lessonName"]))] = q.get("slug")
            quiz_count[cs] = quiz_count.get(cs, 0) + 1

    def topic_slug(title):
        if norm(title) in ALIAS: return ALIAS[norm(title)]
        return name2slug.get(norm(title))

    course = {"course": man["course"], "course_id": man["course_id"], "modules": []}
    stats = {"lessons": 0, "with_theory": 0, "with_quiz": 0, "with_exercise": 0, "full": 0}

    for m in man["modules"]:
        mrec = {"index": m["index"], "title": m["title"], "slug": m["slug"], "topics": []}
        for t in m["topics"]:
            cs = topic_slug(t["title"])
            trec = {"index": t["index"], "title": t["title"], "slug": t["slug"],
                    "course_slug": cs, "lessons": []}
            for l in t["lessons"]:
                key = (cs, norm(l["title"])) if cs else None
                ex = ex_idx.get(key) if key else None
                qz = quiz_idx.get(key) if key else None
                theory_path = f"content/theory/{m['slug']}/{t['slug']}/{l['slug']}.md"
                lrec = {
                    "index": l["index"], "title": l["title"],
                    "theory": theory_path,
                    "quiz": qz,
                    "exercise": ex,
                }
                trec["lessons"].append(lrec)
                stats["lessons"] += 1
                stats["with_theory"] += 1
                if qz: stats["with_quiz"] += 1
                if ex: stats["with_exercise"] += 1
                if qz and ex: stats["full"] += 1
            mrec["topics"].append(trec)
        course["modules"].append(mrec)

    out = ROOT / "content" / "course.json"
    out.write_text(json.dumps(course, ensure_ascii=False, indent=2), encoding="utf-8")

    print("✅ content/course.json собран")
    print(f"   уроков:            {stats['lessons']}")
    print(f"   с теорией:         {stats['with_theory']}")
    print(f"   с квизом:          {stats['with_quiz']}")
    print(f"   с заданием:        {stats['with_exercise']}")
    print(f"   полных (теор+квиз+практ): {stats['full']}")

    # покрытие тем практикой
    print("\n   темы без course_slug (только теория):")
    for m in course["modules"]:
        for t in m["topics"]:
            if not t["course_slug"]:
                print(f"     · {t['title']}")

if __name__ == "__main__":
    main()
