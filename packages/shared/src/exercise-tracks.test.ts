import { describe, expect, it } from "vitest";
import {
  EXERCISE_TRACKS,
  filterExercisesByTrack,
  paginateItems,
  resolveExerciseTrack,
  sortExercisesForCatalog,
} from "./exercise-tracks.js";

const base = {
  slug: "x",
  title: "Task",
  language: "javascript" as const,
  categoryId: "js-basics",
  categoryName: "Основы JavaScript",
};

describe("resolveExerciseTrack", () => {
  it("maps react courses", () => {
    expect(
      resolveExerciseTrack({ ...base, categoryId: "js-react" }),
    ).toBe("react");
    expect(
      resolveExerciseTrack({ ...base, categoryId: "js-redux-toolkit" }),
    ).toBe("react");
  });

  it("maps html and css courses", () => {
    expect(
      resolveExerciseTrack({ ...base, language: "html", categoryId: "css-flex" }),
    ).toBe("html-css");
  });

  it("maps plain javascript", () => {
    expect(resolveExerciseTrack(base)).toBe("javascript");
    expect(
      resolveExerciseTrack({ ...base, categoryId: "javascript" }),
    ).toBe("javascript");
  });

  it("returns null for shell-only tracks", () => {
    expect(
      resolveExerciseTrack({ ...base, language: "shell", categoryId: "cli-basics" }),
    ).toBeNull();
  });
});

describe("filterExercisesByTrack", () => {
  it("keeps only exercises for the selected track", () => {
    const exercises = [
      base,
      { ...base, slug: "r1", categoryId: "js-react", categoryName: "React" },
      {
        ...base,
        slug: "h1",
        language: "html" as const,
        categoryId: "css-grid",
        categoryName: "Grid",
      },
      {
        ...base,
        slug: "s1",
        language: "shell" as const,
        categoryId: "cli-basics",
        categoryName: "CLI",
      },
    ];

    expect(filterExercisesByTrack(exercises, "javascript").map((e) => e.slug)).toEqual([
      "x",
    ]);
    expect(filterExercisesByTrack(exercises, "react").map((e) => e.slug)).toEqual(["r1"]);
    expect(filterExercisesByTrack(exercises, "html-css").map((e) => e.slug)).toEqual(["h1"]);
  });
});

describe("sortExercisesForCatalog", () => {
  it("sorts by course name then title", () => {
    const sorted = sortExercisesForCatalog([
      { ...base, slug: "b", title: "Beta", categoryName: "Z course" },
      { ...base, slug: "a", title: "Alpha", categoryName: "A course" },
      { ...base, slug: "c", title: "Gamma", categoryName: "A course" },
    ]);

    expect(sorted.map((item) => item.slug)).toEqual(["a", "c", "b"]);
  });
});

describe("paginateItems", () => {
  it("returns a slice for the requested page", () => {
    const result = paginateItems([1, 2, 3, 4, 5], { page: 2, pageSize: 2 });

    expect(result.items).toEqual([3, 4]);
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(3);
    expect(result.totalItems).toBe(5);
  });

  it("clamps page to valid range", () => {
    const result = paginateItems([1, 2, 3], { page: 99, pageSize: 2 });

    expect(result.page).toBe(2);
    expect(result.items).toEqual([3]);
  });
});

describe("EXERCISE_TRACKS", () => {
  it("defines three frontend tracks", () => {
    expect(EXERCISE_TRACKS.map((track) => track.id)).toEqual([
      "javascript",
      "react",
      "html-css",
    ]);
  });
});
