import { describe, it, expect } from "vitest";
import { contrastRatio } from "@/lib/contrast";
import { semantic, ramps, resolve } from "@/lib/tokens";

describe("contrast", () => {
  it("computes WCAG ratio for black on white", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
  });
  for (const theme of ["dark", "light"] as const) {
    const surfaces = [
      "surface.ground",
      "surface.raised",
      "surface.sunken",
      "surface.pressed",
    ] as const;
    // surface.pressed is a transient state surface (active button, pressed row, screws, table
    // bands), never a reading surface for links or champagne labels — ruling 2026-09-08.
    const readingSurfaces = ["surface.ground", "surface.raised", "surface.sunken"] as const;
    const bodyText = ["text.primary", "text.secondary"] as const;
    it(`${theme}: body text tokens are AA on every surface`, () => {
      for (const s of surfaces)
        for (const t of bodyText) {
          expect(
            contrastRatio(resolve(t, theme), resolve(s, theme)),
            `${t} on ${s}`,
          ).toBeGreaterThanOrEqual(4.5);
        }
    });
    it(`${theme}: link text is AA on reading surfaces`, () => {
      for (const s of readingSurfaces) {
        expect(
          contrastRatio(resolve("text.link", theme), resolve(s, theme)),
          `text.link on ${s}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    });
    it(`${theme}: muted text and champagne are AA-large on reading surfaces`, () => {
      for (const s of readingSurfaces) {
        expect(
          contrastRatio(resolve("text.muted", theme), resolve(s, theme)),
        ).toBeGreaterThanOrEqual(3);
        expect(
          contrastRatio(resolve("metal.champagne", theme), resolve(s, theme)),
        ).toBeGreaterThanOrEqual(3);
      }
    });
    it(`${theme}: on-accent text is AA on accent`, () => {
      expect(
        contrastRatio(resolve("text.on-accent", theme), resolve("accent.default", theme)),
      ).toBeGreaterThanOrEqual(4.5);
    });
  }
  it("ramps contain the canonical steps", () => {
    expect(ramps.stone["925"]).toBe("#0B0C0F");
    expect(ramps.steel["400"]).toBe("#5B7FDB");
    expect(ramps.champagne["400"]).toBe("#C9A961");
  });
});
