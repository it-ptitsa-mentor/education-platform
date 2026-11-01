import { mkdtemp, mkdir, writeFile, symlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, it } from "vitest";
import { readReferenceFiles } from "./exercise-reference-files.js";

it("reads nested supporting files, excluding student files, private directories and symlinks", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "reference-files-"));
  try {
    const contents = {
      "store.js": "student", "actions.js": "actions", "src/index.js": "support",
      "exercise.json": "manifest", "tests/test.js": "test", "__tests__/test.js": "test",
      "solution/store.js": "answer", "__solution__/store.js": "answer",
      "hexlet/index.js": "copy", "__hexlet__/index.js": "copy",
    };
    for (const [name, content] of Object.entries(contents)) {
      await mkdir(path.dirname(path.join(root, name)), { recursive: true });
      await writeFile(path.join(root, name), content);
    }
    await symlink(path.join(root, "store.js"), path.join(root, "link.js"));
    expect(await readReferenceFiles(root, ["store.js"])).toEqual({
      "actions.js": "actions", "src/index.js": "support",
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
