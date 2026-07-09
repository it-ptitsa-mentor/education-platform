import { describe, expect, it } from "vitest";
import { isPristineStarter, normalizeSource } from "./pristine-starter";

describe("isPristineStarter", () => {
  const starters = {
    "index.html": "<!DOCTYPE html>\n<html>\n  <body><!-- Решение --></body>\n</html>\n",
    "styles/app.css": "/* решение */\n",
  };

  it("считает нетронутый стартер непройденным", () => {
    expect(
      isPristineStarter(starters, { ...starters }, ["index.html", "styles/app.css"]),
    ).toBe(true);
  });

  it("не обманывается косметической правкой (лишние переносы/пробелы)", () => {
    const cosmetic = {
      "index.html": `\n\n${starters["index.html"]}   `,
      "styles/app.css": `${starters["styles/app.css"]}\n\n`,
    };
    expect(isPristineStarter(starters, cosmetic, ["index.html", "styles/app.css"])).toBe(
      true,
    );
  });

  it("пропускает реально изменённый файл", () => {
    const edited = {
      ...starters,
      "styles/app.css": ".catalog { display: flex; flex-wrap: wrap; }",
    };
    expect(isPristineStarter(starters, edited, ["index.html", "styles/app.css"])).toBe(
      false,
    );
  });

  it("падает обратно на ключи стартеров, если список studentFiles пуст", () => {
    expect(isPristineStarter(starters, { ...starters }, [])).toBe(true);
    expect(isPristineStarter({}, {}, [])).toBe(false);
  });

  it("normalizeSource схлопывает пробелы и обрезает края", () => {
    expect(normalizeSource("  a\n\t b  ")).toBe("a b");
  });
});
