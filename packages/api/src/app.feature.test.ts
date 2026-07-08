import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "./app.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

describe("exercise API", () => {
  const app = buildApp({
    exercisesRoot: path.join(repoRoot, "exercises"),
  });

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("lists available js exercises with categories", async () => {
    const response = await app.inject({ method: "GET", url: "/api/exercises" });

    expect(response.statusCode).toBe(200);
    const body = response.json() as {
      exercises: {
        slug: string;
        categoryId: string;
        categoryName: string;
      }[];
    };
    const jsVariables = body.exercises.find((e) => e.slug === "js-variables");
    expect(jsVariables).toBeDefined();
    expect(jsVariables?.categoryId).toBe("javascript");
    expect(jsVariables?.categoryName).toBe("JavaScript");
  });

  it("returns starter code for an exercise", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/exercises/js-variables",
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as {
      title: string;
      files: Record<string, string>;
    };
    expect(body.title).toBe("Переменные");
    expect(body.files["solution.js"]).toContain("console.log");
  });

  it("checks student solution against vitest", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/exercises/js-variables/check",
      payload: {
        files: {
          "solution.js": `const pet = "Dragon";
console.log(pet);
console.log(pet);
`,
        },
      },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as { passed: boolean; stdout: string };
    expect(body.passed).toBe(true);
    expect(body.stdout.length).toBeGreaterThan(0);
  });

  it("returns starter code for every file in a multi-file exercise", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/exercises/js-redux-toolkit-slices",
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as {
      filesToOpen: string[];
      files: Record<string, string>;
    };

    expect(body.filesToOpen).toEqual([
      "src/components/App.jsx",
      "src/components/Comment.jsx",
      "src/slices/commentsSlice.js",
      "src/slices/index.js",
    ]);
    expect(Object.keys(body.files).sort()).toEqual(body.filesToOpen.slice().sort());
    expect(body.files["src/components/App.jsx"]).toContain("function App");
    expect(body.files["src/components/Comment.jsx"]).toContain("function Comment");
  });

  it("checks all submitted files in a multi-file exercise", async () => {
    // Use correct solution implementations (starters intentionally fail behavioral tests).
    const solutionFiles: Record<string, string> = {
      "src/components/App.jsx": [
        "import { useEffect } from 'react';",
        "import { useDispatch } from 'react-redux';",
        "import commentsSlice from '../slices/commentsSlice.js';",
        "export default function App() {",
        "  const dispatch = useDispatch();",
        "  useEffect(() => { dispatch(commentsSlice.actions.addComments([])); }, [dispatch]);",
        "  return null;",
        "}",
      ].join("\n"),
      "src/components/Comment.jsx": [
        "import { useSelector } from 'react-redux';",
        "export default function Comment({ id }) {",
        "  const comment = useSelector((s) => s.comments.items.find((c) => c.id === id));",
        "  const author = useSelector((s) => s.users?.items?.find((u) => u.id === comment?.author));",
        "  if (!comment) return null;",
        "  return <div>{comment.text}</div>;",
        "}",
      ].join("\n"),
      "src/slices/commentsSlice.js": [
        "import { createSlice } from '@reduxjs/toolkit';",
        "const commentsSlice = createSlice({",
        "  name: 'comments', initialState: { items: [] },",
        "  reducers: { addComments: (state, action) => { state.items = action.payload; } },",
        "});",
        "export default commentsSlice;",
      ].join("\n"),
      "src/slices/index.js": [
        "import { configureStore } from '@reduxjs/toolkit';",
        "import usersSlice from './usersSlice.js';",
        "import postsSlice from './postsSlice.js';",
        "import commentsSlice from './commentsSlice.js';",
        "export default configureStore({",
        "  reducer: { users: usersSlice.reducer, posts: postsSlice.reducer, comments: commentsSlice.reducer },",
        "});",
      ].join("\n"),
    };

    const passResponse = await app.inject({
      method: "POST",
      url: "/api/exercises/js-redux-toolkit-slices/check",
      payload: { files: solutionFiles },
    });

    expect(passResponse.statusCode).toBe(200);
    expect(passResponse.json()).toMatchObject({ passed: true });

    const failResponse = await app.inject({
      method: "POST",
      url: "/api/exercises/js-redux-toolkit-slices/check",
      payload: {
        files: {
          ...solutionFiles,
          "src/components/Comment.jsx": "export default 1;",
        },
      },
    });

    expect(failResponse.statusCode).toBe(200);
    expect(failResponse.json()).toMatchObject({ passed: false });
  });

  it("rejects partial file payloads for multi-file exercises", async () => {
    const detailResponse = await app.inject({
      method: "GET",
      url: "/api/exercises/js-redux-toolkit-slices",
    });

    const { files } = detailResponse.json() as { files: Record<string, string> };
    const [firstFile] = Object.keys(files);

    const response = await app.inject({
      method: "POST",
      url: "/api/exercises/js-redux-toolkit-slices/check",
      payload: {
        files: {
          [firstFile]: files[firstFile],
        },
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: expect.stringMatching(/Missing required files/i),
    });
  });
});
