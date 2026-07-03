import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const fixturesPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "__fixtures__",
);

const loadAll = async () => {
  const File = (await import("../src/File.js")).default;
  const utilsMod = await import("../src/Utils.js");
  const readFiles = utilsMod.readFiles ?? utilsMod.default?.readFiles;
  const FileError = (await import("../src/errors/FileError.js")).default;
  const NotExistsError = (await import("../src/errors/NotExistsError.js")).default;
  const NotReadableError = (await import("../src/errors/NotReadableError.js")).default;
  if (typeof File !== "function") {
    throw new Error("Экспортируйте класс File (export default)");
  }
  if (typeof readFiles !== "function") {
    throw new Error("Экспортируйте функцию readFiles из Utils.js");
  }
  return { File, readFiles, FileError, NotExistsError, NotReadableError };
};

describe("js-classes-exceptions", () => {
  it("иерархия исключений", async () => {
    const { FileError, NotExistsError, NotReadableError } = await loadAll();
    expect(new FileError("boom")).toBeInstanceOf(Error);
    expect(new NotExistsError("boom")).toBeInstanceOf(FileError);
    expect(new NotReadableError("boom")).toBeInstanceOf(FileError);
    expect(new NotExistsError("boom").message).toBe("boom");
  });

  it("read() читает существующий файл", async () => {
    const { File } = await loadAll();
    const file = new File(path.join(fixturesPath, "data.txt"));
    expect(file.read()).toBe("file content\n");
  });

  it("read() бросает NotExistsError для несуществующего файла", async () => {
    const { File, NotExistsError } = await loadAll();
    const file = new File(path.join(fixturesPath, "nonexists.txt"));
    expect(() => file.read()).toThrow(NotExistsError);
  });

  it("readFiles() возвращает null для проблемных файлов", async () => {
    const { readFiles } = await loadAll();
    const values = readFiles([
      path.join(fixturesPath, "data.txt"),
      path.join(fixturesPath, "unknown.txt"),
    ]);
    expect(values).toEqual(["file content\n", null]);
  });
});
