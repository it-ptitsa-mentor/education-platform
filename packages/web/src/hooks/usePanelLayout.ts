import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ptitsa.trainer.panel-layout.v2";
const LEGACY_STORAGE_KEY = "ptitsa.trainer.panel-layout.v1";

export type PanelLayout = {
  readmeWidth: number;
  outputHeight: number;
};

export const DEFAULT_PANEL_LAYOUT: PanelLayout = {
  readmeWidth: 420,
  outputHeight: 168,
};

const README_MIN = 320;
const README_MAX = 560;
/** Saved widths below this were too narrow on lesson exercise pages. */
const LEGACY_NARROW_README = 360;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const normalizePanelLayout = (
  partial: Partial<PanelLayout> = {},
): PanelLayout => {
  const rawReadme = partial.readmeWidth ?? DEFAULT_PANEL_LAYOUT.readmeWidth;
  const readmeWidth =
    rawReadme < LEGACY_NARROW_README
      ? DEFAULT_PANEL_LAYOUT.readmeWidth
      : clamp(rawReadme, README_MIN, README_MAX);

  return {
    readmeWidth,
    outputHeight: clamp(
      partial.outputHeight ?? DEFAULT_PANEL_LAYOUT.outputHeight,
      96,
      420,
    ),
  };
};

const readLayout = (): PanelLayout => {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return DEFAULT_PANEL_LAYOUT;
    return normalizePanelLayout(JSON.parse(raw) as Partial<PanelLayout>);
  } catch {
    return DEFAULT_PANEL_LAYOUT;
  }
};

export const usePanelLayout = () => {
  const [layout, setLayout] = useState<PanelLayout>(DEFAULT_PANEL_LAYOUT);

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
        readmeWidth: clamp(readmeWidth, README_MIN, README_MAX),
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
