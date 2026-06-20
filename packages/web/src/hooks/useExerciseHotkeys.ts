import { useEffect } from "react";
import { isRunTestsHotkey } from "../lib/exercise-hotkeys";

type UseExerciseHotkeysOptions = {
  enabled: boolean;
  onRunTests: () => void;
};

export const useExerciseHotkeys = ({
  enabled,
  onRunTests,
}: UseExerciseHotkeysOptions) => {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isRunTestsHotkey(event)) {
        return;
      }

      const target = event.target;
      if (target instanceof HTMLElement && target.closest(".monaco-editor")) {
        return;
      }

      event.preventDefault();
      onRunTests();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onRunTests]);
};
