/**
 * Imports the ORIGINAL exercise files (starters, fixtures, provided sources and
 * — most importantly — the reference Hexlet tests) from the per-exercise
 * evaluator container that backs each lesson's web IDE.
 *
 * Flow per exercise:
 *   1. GET the exercise_unit page, parse the Inertia payload.
 *   2. Read `run.ide_url` — the evaluator container hosting a socket.io server.
 *   3. Speak engine.io v4 polling to it (no deps): fs.loadFileTree /
 *      fs.loadDirectory / fs.openFiles to pull every file with contents.
 *   4. Mirror everything raw into exercises/<slug>/__hexlet__/ (audit trail,
 *      excluded from the runner) and lay down usable files:
 *        - files_to_open  -> starter files
 *        - __tests__/*    -> adapted reference test (jsdom + __dirname shim)
 *        - everything else (index.html, __fixtures__, provided src/*) -> as-is
 *
 * Requires a valid .hexlet-cookies.json at the repo root (a logged-in session).
 *
 * Usage:
 *   pnpm import:hexlet-files --slug js-dom-events
 *   pnpm import:hexlet-files --course js-dom
 *   pnpm import:hexlet-files            # every exercise in catalog.json
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cookiesPath = path.join(repoRoot, ".hexlet-cookies.json");
const exercisesRoot = path.join(repoRoot, "exercises");
const catalogPath = path.join(repoRoot, "scripts/hexlet-import/catalog.json");

type Cookie = { name: string; value: string };

type CatalogEntry = {
  slug: string;
  courseSlug: string;
  hexletExerciseSlug: string;
  sourceUrl: string;
  filesToOpen: string[];
};

type TreeNode = {
  type: "file" | "directory";
  nodeProps: { filepath: string; content?: string | null };
  children?: TreeNode[];
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const loadCookies = async (): Promise<string> => {
  const cookies = JSON.parse(await readFile(cookiesPath, "utf8")) as Cookie[];
  return cookies.map((c) => `${c.name}=${c.value}`).join("; ");
};

const fetchProps = async (
  url: string,
  cookieHeader: string,
): Promise<Record<string, unknown>> => {
  const response = await fetch(url, {
    headers: { Cookie: cookieHeader, Accept: "text/html", "User-Agent": "Mozilla/5.0" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const html = await response.text();
  const match = html.match(/<script[^>]*data-page="app"[^>]*>(\{.*?\})<\/script>/s);
  if (!match) throw new Error(`No Inertia payload for ${url}`);
  const page = JSON.parse(match[1]) as { props: Record<string, unknown> };
  return page.props;
};

/** Minimal engine.io v4 polling client — just enough for the IDE file RPCs. */
class IdeClient {
  private base: string;
  private sid = "";
  private ackId = 0;

  constructor(
    ideUrl: string,
    private cookieHeader: string,
  ) {
    this.base = ideUrl.replace(/\/$/, "");
  }

  private async post(body: string): Promise<void> {
    const url = `${this.base}/socket.io/?EIO=4&transport=polling&sid=${this.sid}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Cookie: this.cookieHeader, "User-Agent": "Mozilla/5.0", "Content-Type": "text/plain" },
      body,
    });
    if (!res.ok) throw new Error(`POST ${res.status}`);
  }

  private async get(withSid = true): Promise<string> {
    const suffix = withSid ? `&sid=${this.sid}` : "";
    const url = `${this.base}/socket.io/?EIO=4&transport=polling${suffix}`;
    const res = await fetch(url, {
      headers: { Cookie: this.cookieHeader, "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) throw new Error(`GET ${res.status}`);
    return res.text();
  }

  async connect(): Promise<void> {
    let handshake = "";
    // The container may be cold on first page load (404 until it boots).
    for (let attempt = 0; attempt < 20; attempt += 1) {
      try {
        handshake = await this.get(false);
        break;
      } catch (error) {
        if (attempt === 19) throw error;
        await sleep(2000);
      }
    }
    this.sid = JSON.parse(handshake.slice(1)).sid;
    await this.post("40"); // open default namespace
    await this.get(); // drain namespace ack + greeting events
  }

  async rpc<T>(event: string, arg: unknown): Promise<T> {
    const id = ++this.ackId;
    await this.post(`42${id}${JSON.stringify([event, arg])}`);
    const marker = `43${id}`;
    for (let attempt = 0; attempt < 15; attempt += 1) {
      const payload = await this.get();
      for (const packet of payload.split("\x1e")) {
        if (packet.startsWith(marker)) {
          return JSON.parse(packet.slice(marker.length))[0] as T;
        }
      }
      await sleep(200);
    }
    throw new Error(`No ack for ${event}`);
  }

  async loadAllFiles(): Promise<Map<string, string>> {
    const files = new Map<string, string>();
    const filePaths: string[] = [];
    const pendingDirs: string[] = [];

    const collect = (children: TreeNode[] = []) => {
      for (const child of children) {
        const fp = child.nodeProps.filepath;
        if (child.type === "directory") pendingDirs.push(fp);
        else filePaths.push(fp);
      }
    };

    const root = await this.rpc<TreeNode>("fs.loadFileTree", []);
    collect(root.children);
    while (pendingDirs.length > 0) {
      const dir = pendingDirs.shift()!;
      const res = await this.rpc<{ directory: TreeNode }>("fs.loadDirectory", dir);
      collect(res.directory.children);
    }

    const opened = await this.rpc<TreeNode[]>("fs.openFiles", filePaths);
    for (const node of opened) {
      const { filepath, content } = node.nodeProps;
      if (typeof content === "string") files.set(filepath, content);
    }
    return files;
  }
}

const SKIP_FILES = new Set(["package.json", "Makefile", ".gitignore"]);
const isSkipped = (p: string) =>
  SKIP_FILES.has(p) ||
  p.startsWith("node_modules/") ||
  /(^|\/)vite\.config\./.test(p);

/** Turn a Hexlet vitest test into one our temp-dir runner can execute. */
const adaptTest = (content: string): string => {
  let out = content;
  // Drop jest-dom side-effect imports; matchers come from our setup file
  // (importing the CJS "/vitest" entry breaks under vite).
  out = out.replace(
    /^\s*import\s+['"]@testing-library\/jest-dom(?:\/vitest)?['"];?\s*$/gm,
    "",
  );

  const needsDom = /\b(document|window|jsdom|testing-library|screen)\b/.test(out);
  const needsDirname = /\b__dirname\b/.test(out);

  const header: string[] = [];
  if (needsDom) header.push("// @vitest-environment jsdom");
  if (needsDirname) {
    header.push(
      "import { fileURLToPath as __toPath } from 'node:url';",
      "import __nodePath from 'node:path';",
      "const __dirname = __nodePath.dirname(__toPath(import.meta.url));",
    );
  }
  return header.length > 0 ? `${header.join("\n")}\n${out.replace(/^\n+/, "")}` : out;
};

const writeExerciseFiles = async (
  entry: CatalogEntry,
  files: Map<string, string>,
): Promise<{ tests: string[]; provided: string[] }> => {
  const exerciseDir = path.join(exercisesRoot, entry.slug);
  const studentFiles = new Set(entry.filesToOpen);
  const tests: string[] = [];
  const provided: string[] = [];

  // Raw audit mirror (excluded from the runner via the __hexlet__ filter).
  const mirrorDir = path.join(exerciseDir, "__hexlet__");
  await rm(mirrorDir, { recursive: true, force: true });

  for (const [filePath, content] of files) {
    const mirrorPath = path.join(mirrorDir, filePath);
    await mkdir(path.dirname(mirrorPath), { recursive: true });
    await writeFile(mirrorPath, content, "utf8");

    if (isSkipped(filePath)) continue;

    const target = path.join(exerciseDir, filePath);
    await mkdir(path.dirname(target), { recursive: true });

    if (filePath.startsWith("__tests__/")) {
      await writeFile(target, adaptTest(content), "utf8");
      tests.push(filePath);
    } else if (studentFiles.has(filePath)) {
      await writeFile(target, content, "utf8");
    } else {
      await writeFile(target, content, "utf8");
      provided.push(filePath);
    }
  }

  // Remove our stub tests once the real Hexlet test(s) landed.
  if (tests.length > 0) {
    for (const stub of ["placeholder.test.js", "exercise.test.js"]) {
      await rm(path.join(exerciseDir, "__tests__", stub), { force: true });
    }
  }
  return { tests, provided };
};

const main = async () => {
  const args = process.argv.slice(2);
  const slugArg = args[args.indexOf("--slug") + 1];
  const courseArg = args[args.indexOf("--course") + 1];

  const cookieHeader = await loadCookies();
  const catalog = JSON.parse(await readFile(catalogPath, "utf8")) as CatalogEntry[];

  let targets = catalog;
  if (args.includes("--slug")) targets = catalog.filter((e) => e.slug === slugArg);
  else if (args.includes("--course")) targets = catalog.filter((e) => e.courseSlug === courseArg);

  console.log(`Importing ${targets.length} exercise(s)...`);
  const failures: string[] = [];

  for (const entry of targets) {
    try {
      const props = await fetchProps(entry.sourceUrl, cookieHeader);
      const run = props.run as { ide_url?: string; server_status?: string } | undefined;
      if (!run?.ide_url) throw new Error("no run.ide_url on page");

      const client = new IdeClient(run.ide_url, cookieHeader);
      await client.connect();
      const files = await client.loadAllFiles();
      const { tests, provided } = await writeExerciseFiles(entry, files);
      console.log(
        `✓ ${entry.slug}: ${files.size} files (tests: ${tests.length}, provided: ${provided.length})`,
      );
    } catch (error) {
      console.error(`✗ ${entry.slug}: ${(error as Error).message}`);
      failures.push(entry.slug);
    }
    await sleep(800); // be gentle with the evaluator
  }

  console.log(`\nDone. ${targets.length - failures.length}/${targets.length} imported.`);
  if (failures.length > 0) {
    console.log(`Failed: ${failures.join(", ")}`);
    process.exitCode = 1;
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
