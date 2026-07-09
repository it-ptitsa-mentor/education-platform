import { describe, expect, it } from "vitest";
import {
  groupExercisesByCategory,
  resolveExerciseCategory,
} from "./exercise-categories.js";

describe("resolveExerciseCategory", () => {
  it("uses hexlet course when present", () => {
    expect(
      resolveExerciseCategory({
        slug: "js-basics-hello-world",
        language: "javascript",
        hexlet: {
          courseSlug: "js-basics",
          courseName: "Основы JavaScript",
          lessonSlug: "hello-world",
          lessonName: "Hello, World!",
          exerciseSlug: "js_basics_hello_world_exercise",
          sourceUrl: "https://example.com",
        },
      }),
    ).toEqual({
      categoryId: "js-basics",
      categoryName: "Основы JavaScript",
    });
  });

  it("falls back to language label", () => {
    expect(
      resolveExerciseCategory({
        slug: "js-variables",
        language: "javascript",
      }),
    ).toEqual({
      categoryId: "javascript",
      categoryName: "JavaScript",
    });
  });
});

describe("groupExercisesByCategory", () => {
  it("groups and sorts categories and titles", () => {
    const groups = groupExercisesByCategory([
      {
        slug: "b",
        title: "Beta",
        language: "javascript",
        categoryId: "js-basics",
        categoryName: "Основы JavaScript",
        testClass: "custom",
      },
      {
        slug: "a",
        title: "Alpha",
        language: "javascript",
        categoryId: "js-basics",
        categoryName: "Основы JavaScript",
        testClass: "custom",
      },
      {
        slug: "css",
        title: "Flex",
        language: "html",
        categoryId: "css-flex",
        categoryName: "CSS: Flex",
        testClass: "stub",
      },
    ]);

    expect(groups.map((group) => group.name)).toEqual([
      "Основы JavaScript",
      "CSS: Flex",
    ]);
    expect(groups[0]?.exercises.map((item) => item.slug)).toEqual(["a", "b"]);
  });
});
