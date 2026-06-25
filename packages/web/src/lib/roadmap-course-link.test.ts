import { describe, expect, it } from "vitest";
import {
  buildHexletTopicIndex,
  extractBuildinTopicId,
  filterRoadmapDisplayLinks,
  isBuildinCourseLink,
  resolveCourseTopicByBuildinId,
} from "./roadmap-course-link";

describe("roadmap course link", () => {
  const manifest = {
    modules: [
      {
        slug: "01-modul-1",
        topics: [
          {
            id: "542ad5bc-e9e8-4a7b-8465-7b73067dbdd7",
            slug: "01-osnovy-sovremennoy-verstki",
            title: "Основы современной верстки",
          },
        ],
      },
    ],
  };

  it("extracts buildin topic uuid from course link", () => {
    expect(
      extractBuildinTopicId(
        "https://buildin.ai/542ad5bc-e9e8-4a7b-8465-7b73067dbdd7",
      ),
    ).toBe("542ad5bc-e9e8-4a7b-8465-7b73067dbdd7");
  });

  it("extracts uuid from buildin workspace path", () => {
    expect(
      extractBuildinTopicId(
        "https://buildin.ai/it-ptitsa/c481a5ff-be65-4ec2-8fa2-603680be0394",
      ),
    ).toBe("c481a5ff-be65-4ec2-8fa2-603680be0394");
  });

  it("hides buildin course links from roadmap materials", () => {
    const links = [
      {
        type: "course",
        title: "Buildin: Event Loop",
        url: "https://buildin.ai/it-ptitsa/c481a5ff-be65-4ec2-8fa2-603680be0394",
      },
      {
        type: "official",
        title: "MDN",
        url: "https://developer.mozilla.org/",
      },
      {
        type: "course",
        title: "Learn Prompting",
        url: "https://learnprompting.org/",
      },
    ];
    expect(isBuildinCourseLink(links[0])).toBe(true);
    expect(isBuildinCourseLink(links[2])).toBe(false);
    expect(filterRoadmapDisplayLinks(links)).toEqual([links[1], links[2]]);
  });

  it("maps buildin id to hexlet module/topic slugs", () => {
    const index = buildHexletTopicIndex(manifest);
    const hit = resolveCourseTopicByBuildinId(
      "542ad5bc-e9e8-4a7b-8465-7b73067dbdd7",
      index,
    );
    expect(hit).toEqual({
      moduleSlug: "01-modul-1",
      topicSlug: "01-osnovy-sovremennoy-verstki",
      title: "Основы современной верстки",
    });
  });
});
