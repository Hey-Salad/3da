import { describe, expect, it } from "vitest";
import { canReserve, printers, windowsOverlap } from "./index";

const slot = (printerId: string, start: string, end: string) => ({ printerId, start, end });

describe("reservation policy", () => {
  it("treats touching half-open windows as non-conflicting", () => {
    const first = slot("samantha", "2026-09-03T09:00:00.000Z", "2026-09-03T10:00:00.000Z");
    const second = slot("samantha", "2026-09-03T10:00:00.000Z", "2026-09-03T11:00:00.000Z");
    expect(windowsOverlap(first, second)).toBe(false);
  });

  it("rejects an overlapping reservation for the same printer", () => {
    const existing = slot("samantha", "2026-09-03T09:00:00.000Z", "2026-09-03T10:00:00.000Z");
    const requested = slot("samantha", "2026-09-03T09:30:00.000Z", "2026-09-03T10:30:00.000Z");
    expect(canReserve(printers[0]!, requested, [existing])).toEqual({ ok: false, reason: "RESERVATION_CONFLICT" });
  });

  it("rejects a printer that is not available", () => {
    const requested = slot("simone", "2026-09-03T09:00:00.000Z", "2026-09-03T10:00:00.000Z");
    expect(canReserve(printers[1]!, requested, [])).toEqual({ ok: false, reason: "PRINTER_UNAVAILABLE" });
  });
});
