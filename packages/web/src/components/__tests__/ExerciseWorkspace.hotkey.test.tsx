import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { ExerciseDetail } from "../../exercise-types";
import { ExerciseWorkspace } from "../ExerciseWorkspace";

// Monaco заменён фейком: onMount вызывается один раз (как в реальном редакторе),
// а зарегистрированные actions складываются в map, чтобы «нажать» Ctrl+Enter вручную.
const actions = new Map<string, () => unknown>();
const fakeEditor = {
  addAction: ({ id, run }: { id: string; run: () => unknown }) => actions.set(id, run),
  addCommand: () => undefined,
  getAction: () => null,
  getModel: () => null,
};
const fakeMonaco = { KeyMod: { CtrlCmd: 1, Shift: 2, Alt: 4 }, KeyCode: { Enter: 8, KeyF: 16, KeyS: 32 } };

vi.mock("@monaco-editor/react", async () => {
  const { useEffect } = await import("react");
  return {
    default: ({ onMount }: { onMount?: (e: unknown, m: unknown) => void }) => {
      useEffect(() => {
        onMount?.(fakeEditor, fakeMonaco);
      }, []);
      return <div data-testid="editor" />;
    },
  };
});
vi.mock("../../lib/monaco-setup", () => ({
  setupMonaco: () => undefined,
  bindJsxSyntaxHighlight: () => () => undefined,
}));

const exercise: ExerciseDetail = {
  slug: "ex",
  title: "Упражнение",
  language: "javascript",
  filesToOpen: ["index.js"],
  readme: "",
  files: { "index.js": "" },
};

const renderWorkspace = (onRunTests: () => void) => (
  <MemoryRouter>
    <ExerciseWorkspace
      exercise={exercise}
      files={{ "index.js": "" }}
      activeFile="index.js"
      onActiveFileChange={() => undefined}
      onFileChange={() => undefined}
      result={null}
      onRunTests={onRunTests}
    />
  </MemoryRouter>
);

describe("ExerciseWorkspace — Ctrl+Enter", () => {
  it("вызывает актуальный onRunTests после ререндера, а не замкнутый при монтировании", () => {
    actions.clear();
    const stale = vi.fn();
    const fresh = vi.fn();
    const { rerender } = render(renderWorkspace(stale));

    rerender(renderWorkspace(fresh));
    actions.get("ptitsa-run-tests")?.();

    expect(fresh).toHaveBeenCalledTimes(1);
    expect(stale).not.toHaveBeenCalled();
  });
});
