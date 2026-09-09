import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/work", "/work/process-discovery", "/consulting", "/about"];
const THEMES = ["dark", "light"] as const;

test.describe("a11y", () => {
  for (const route of ROUTES) {
    for (const theme of THEMES) {
      test(`${route} has zero axe violations in ${theme} theme`, async ({ page }) => {
        // Set next-themes' storage key before first paint rather than
        // clicking the header ThemeToggle: that control is
        // `hidden md:inline-flex` (desktop-only by design — mobile gets
        // MobileSheet's nav instead, with no theme switch), so it isn't
        // present at every viewport this spec runs under (see the
        // "mobile" Playwright project). Pre-seeding localStorage exercises
        // the same code path next-themes' own inline script reads on load
        // and works identically at any viewport.
        await page.addInitScript((t) => {
          try {
            window.localStorage.setItem("theme", t);
          } catch {
            // ignore — the inline script degrades to the default theme
          }
        }, theme);
        await page.goto(route);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

        if (route === "/") {
          // The hero headline's once-per-load choreography (word stagger,
          // ~0.7s to the last word) transiently renders words at
          // `opacity: 0` mid-animation — real, but not permanent (nothing
          // is hidden after mount, and none of it is present at all with
          // JS disabled or reduced motion; see tests/e2e/home.spec.ts).
          // Wait for it to settle before scanning contrast so this test
          // measures the page's actual resting state, not a mid-tween
          // frame.
          await expect(page.locator("h1 .inline-block").last()).toHaveCSS("opacity", "1");
        }

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
      });
    }
  }
});
