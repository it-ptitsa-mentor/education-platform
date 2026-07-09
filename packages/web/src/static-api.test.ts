import { describe, expect, it } from "vitest";
import { staticCheckExercise, staticFetchExercise } from "./static-api";

describe("staticCheckExercise — guard против нетронутого стартера", () => {
  it("не засчитывает задание, если прислан исходный стартер", async () => {
    const slug = "css-flex-wrap";
    const detail = await staticFetchExercise(slug);
    // Присылаем ровно стартеры, которые редактор показывает по умолчанию.
    const result = await staticCheckExercise(slug, { ...detail.files });

    expect(result.passed).toBe(false);
    expect(result.stderr).toMatch(/не изменён/i);
  });

  it("не обманывается косметической правкой (лишние переносы строк)", async () => {
    const slug = "css-flex-wrap";
    const detail = await staticFetchExercise(slug);
    const padded = Object.fromEntries(
      Object.entries(detail.files).map(([path, content]) => [
        path,
        `\n${content}\n\n`,
      ]),
    );

    const result = await staticCheckExercise(slug, padded);

    expect(result.passed).toBe(false);
  });

  it("пропускает проверку дальше, если код реально изменён", async () => {
    const slug = "css-flex-wrap";
    const detail = await staticFetchExercise(slug);
    const edited = {
      ...detail.files,
      "styles/app.css": `${detail.files["styles/app.css"] ?? ""}\n.catalog { display: flex; }\n`,
    };

    const result = await staticCheckExercise(slug, edited);

    // Guard пропустил — дальше отрабатывает обычная browser-проверка
    // (её вердикт нам тут не важен, важно что это НЕ наш guard-отказ).
    expect(result.stderr).not.toMatch(/Стартовый код не изменён/);
  });
});
