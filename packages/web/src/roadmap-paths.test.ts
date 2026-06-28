import { describe, expect, it } from "vitest";
import { findCatalogProfession, professionPath } from "./roadmap";

describe("professionPath", () => {
  it("encodes profession id in URL", () => {
    expect(professionPath("frontend")).toBe("/professions/frontend");
    expect(professionPath("go")).toBe("/professions/go");
  });
});

describe("findCatalogProfession", () => {
  const catalog = {
    professions: [
      { id: "frontend", title: "JS-разработчик", roadmaps: [] },
      { id: "go", title: "Go-разработчик", status: "soon" as const, roadmaps: [] },
    ],
  };

  it("returns profession by id", () => {
    expect(findCatalogProfession(catalog, "frontend")?.title).toBe("JS-разработчик");
    expect(findCatalogProfession(catalog, "go")?.title).toBe("Go-разработчик");
  });

  it("returns null for unknown id", () => {
    expect(findCatalogProfession(catalog, "missing")).toBeNull();
  });
});
