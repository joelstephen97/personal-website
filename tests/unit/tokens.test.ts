import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
const css = readFileSync("src/styles/tokens.css", "utf8");
describe("tokens.css", () => {
  it("defines both themes", () => {
    expect(css).toMatch(
      /:root\[data-theme="light"\]\s*\{[^}]*--surface-ground: var\(--color-stone-50\)/,
    );
    expect(css).toMatch(/--surface-ground: var\(--color-stone-925\)/);
  });
  it("defines every semantic token in both themes", () => {
    for (const v of [
      "--text-primary",
      "--accent-default",
      "--metal-champagne",
      "--glass-bg",
      "--code-keyword",
      "--border-focus",
    ]) {
      expect(css.split(v).length - 1, v).toBeGreaterThanOrEqual(2);
    }
  });
  it("has no raw hex in semantic blocks except rgba literals", () => {
    const light = css.slice(css.indexOf(':root[data-theme="light"]'));
    expect(light).not.toMatch(/#[0-9A-Fa-f]{6}/);
  });
});
