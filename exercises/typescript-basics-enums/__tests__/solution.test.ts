// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { ModalStatus, buildModal } from "../solution.ts";

describe("typescript-basics-enums: ModalStatus + buildModal()", () => {
  it("ModalStatus has Opened and Closed", () => {
    expect(ModalStatus.Opened).toBeDefined();
    expect(ModalStatus.Closed).toBeDefined();
  });
  it("buildModal returns correct object", () => {
    const modal = buildModal('hexlet forever', ModalStatus.Opened);
    expect(modal.text).toBe('hexlet forever');
    expect(modal.status).toBe(ModalStatus.Opened);
  });
  it("buildModal with Closed status", () => {
    const modal = buildModal('bye', ModalStatus.Closed);
    expect(modal.status).toBe(ModalStatus.Closed);
  });
});
