import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import { ExerciseWorkspace } from "../ExerciseWorkspace";
import type { ExerciseDetail } from "../../exercise-types";

const model = vi.hoisted(() => ({ uri: { path: "" }, getValue: () => "student draft" }));
vi.mock("@monaco-editor/react", async () => {
  const { useEffect } = await import("react");
  return {
    default: ({ value, options, onChange, onMount }: {
      value: string;
      options: { readOnly: boolean };
      onChange: (value: string) => void;
      onMount: (editor: unknown, monaco: unknown) => void;
    }) => {
      useEffect(() => { onMount({ getModel: () => model }, {}); }, []);
      return (
        <textarea
          aria-label="Test editor"
          value={value}
          readOnly={options.readOnly}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    },
  };
});
vi.mock("../../lib/monaco-setup", () => ({
  setupMonaco: () => undefined, bindJsxSyntaxHighlight: () => () => undefined,
}));

it("shows supporting tabs read-only without updating student code during model switches", () => {
  const exercise: ExerciseDetail = {
    slug: "js-redux-toolkit-redux",
    title: "Redux",
    language: "javascript",
    filesToOpen: ["store.js"],
    files: { "store.js": "student draft" },
    referenceFiles: { "actions.js": "export const addTask = task => ({ payload: task });" },
    readme: "",
  };
  const onFileChange = vi.fn();
  const onActiveFileChange = vi.fn();
  const view = (activeFile: string) => <MemoryRouter><ExerciseWorkspace
    exercise={exercise} files={exercise.files} referenceFiles={exercise.referenceFiles}
    activeFile={activeFile} onActiveFileChange={onActiveFileChange}
    onFileChange={onFileChange} result={null}
  /></MemoryRouter>;
  model.uri.path = "/js-redux-toolkit-redux/store.js";
  const { rerender } = render(view("store.js"));
  // Simulate Monaco swapping the model before React replaces onChange.
  model.uri.path = "/js-redux-toolkit-redux/actions.js";
  fireEvent.change(screen.getByLabelText("Test editor"), { target: { value: "reference content" } });
  expect(onFileChange).not.toHaveBeenCalled();
  model.uri.path = "/js-redux-toolkit-redux/store.js";
  expect(screen.getByLabelText("Test editor")).not.toHaveAttribute("readonly");
  fireEvent.click(screen.getByRole("tab", { name: "actions.js read-only" }));
  expect(onActiveFileChange).toHaveBeenCalledWith("actions.js");
  onFileChange.mockClear();
  model.uri.path = "/js-redux-toolkit-redux/actions.js";
  rerender(view("actions.js"));
  expect(screen.getByLabelText("Test editor")).toHaveAttribute("readonly");
  expect(screen.getByLabelText("Test editor")).toHaveValue(exercise.referenceFiles!["actions.js"]);
  fireEvent.change(screen.getByLabelText("Test editor"), { target: { value: "changed" } });
  expect(onFileChange).not.toHaveBeenCalled();
  rerender(view("store.js"));
  expect(screen.getByLabelText("Test editor")).not.toHaveAttribute("readonly");
});

it("keeps exercises without references to their editable files", () => {
  const exercise: ExerciseDetail = {
    slug: "js-basics-hello-world",
    title: "Hello, World!",
    language: "javascript",
    filesToOpen: ["solution.js"],
    files: { "solution.js": "// Write your solution here" },
    readme: "",
  };
  render(<MemoryRouter><ExerciseWorkspace
    exercise={exercise} files={exercise.files} activeFile="solution.js"
    onActiveFileChange={vi.fn()} onFileChange={vi.fn()} result={null}
  /></MemoryRouter>);
  expect(screen.getByRole("tab", { name: "solution.js" })).toBeInTheDocument();
  expect(screen.queryByText("read-only")).not.toBeInTheDocument();
  expect(screen.getByLabelText("Test editor")).not.toHaveAttribute("readonly");
});
