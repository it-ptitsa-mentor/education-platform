import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ptitsa.trainer.panel-layout.v1";

type PanelLayout = {
  readmeWidth: number;
  outputHeight: number;
};

const DEFAULT_LAYOUT: PanelLayout = {
  readmeWidth: 300,
  outputHeight: 168,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const readLayout = (): PanelLayout => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LAYOUT;
    const parsed = JSON.parse(raw) as Partial<PanelLayout>;
    return {
      readmeWidth: parsed.readmeWidth ?? DEFAULT_LAYOUT.readmeWidth,
      outputHeight: parsed.outputHeight ?? DEFAULT_LAYOUT.outputHeight,
    };
  } catch {
    return DEFAULT_LAYOUT;
  }
};

export const usePanelLayout = () => {
  const [layout, setLayout] = useState<PanelLayout>(DEFAULT_LAYOUT);

  useEffect(() => {
    setLayout(readLayout());
  }, []);

  const persist = useCallback((updater: (current: PanelLayout) => PanelLayout) => {
    setLayout((current) => {
      const next = updater(current);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setReadmeWidth = useCallback(
    (readmeWidth: number) => {
      persist((current) => ({
        ...current,
        readmeWidth: clamp(readmeWidth, 220, 520),
      }));
    },
    [persist],
  );

  const setOutputHeight = useCallback(
    (outputHeight: number) => {
      persist((current) => ({
        ...current,
        outputHeight: clamp(outputHeight, 96, 420),
      }));
    },
    [persist],
  );

  return { layout, setReadmeWidth, setOutputHeight };
};
