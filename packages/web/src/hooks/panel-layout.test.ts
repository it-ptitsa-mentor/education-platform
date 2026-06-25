import { describe, expect, it } from "vitest";
import {
  DEFAULT_PANEL_LAYOUT,
  normalizePanelLayout,
} from "./usePanelLayout";

describe("normalizePanelLayout", () => {
  it("uses wider default for new layouts", () => {
    expect(normalizePanelLayout({})).toEqual(DEFAULT_PANEL_LAYOUT);
    expect(DEFAULT_PANEL_LAYOUT.readmeWidth).toBeGreaterThanOrEqual(420);
  });

  it("migrates legacy narrow readme widths", () => {
    expect(normalizePanelLayout({ readmeWidth: 300 }).readmeWidth).toBe(420);
    expect(normalizePanelLayout({ readmeWidth: 280 }).readmeWidth).toBe(420);
  });

  it("keeps user-resized widths above the legacy floor", () => {
    expect(normalizePanelLayout({ readmeWidth: 480 }).readmeWidth).toBe(480);
  });
});
