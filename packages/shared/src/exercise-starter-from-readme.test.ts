import { describe, expect, it } from "vitest";
import {
  extractCodeFromReadme,
  starterForFile,
} from "./exercise-starter-from-readme.js";

describe("extractCodeFromReadme", () => {
  it("uses section-scoped code for multi-file exercises", () => {
    const readme = `
### src/App.jsx
\`\`\`jsx
export default function App() {
  return <main />;
}
\`\`\`

### src/data.js
\`\`\`javascript
export const items = [];
\`\`\`

\`\`\`javascript
export const sharedFixture = true;
\`\`\`
`;

    expect(
      extractCodeFromReadme(readme, "src/App.jsx", [
        "src/App.jsx",
        "src/data.js",
      ]),
    ).toContain("function App");

    expect(
      extractCodeFromReadme(readme, "src/data.js", [
        "src/App.jsx",
        "src/data.js",
      ]),
    ).toBe("export const items = [];");
  });

  it("does not copy a single readme block into every file", () => {
    const readme = `
\`\`\`javascript
const users = [];
\`\`\`
`;

    expect(
      extractCodeFromReadme(readme, "src/App.jsx", [
        "src/App.jsx",
        "src/Comment.jsx",
      ]),
    ).toBeNull();
  });

  it("keeps single-file shortcut for one-file exercises", () => {
    const readme = `
\`\`\`javascript
export const answer = 42;
\`\`\`
`;

    expect(extractCodeFromReadme(readme, "solution.js", ["solution.js"])).toBe(
      "export const answer = 42;",
    );
  });
});

describe("starterForFile", () => {
  it("names jsx components from file basename", () => {
    expect(
      starterForFile(
        "src/components/Comment.jsx",
        "readme without code",
        "javascript",
        ["src/components/Comment.jsx"],
      ),
    ).toContain("function Comment");
  });
});
