import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/work", "/work/process-discovery", "/consulting", "/about"];
const THEMES = ["dark", "light"] as const;

/**
 * `data-theme` can transiently flicker back to the SSR default (`dark`)
 * for a frame or two, a variable number of ms after mount — next-themes'
 * blocking anti-FOUC script sets the attribute correctly before paint,
 * but its React provider's own mount effect briefly resets to
 * `defaultTheme` before settling back to the localStorage-resolved value.
 * Confirmed by sampling `getComputedStyle` every 10ms through mount:
 * `data-theme` reads dark → light → dark → light and then holds, with
 * the exact timing of the second flip varying run to run. Poll until the
 * attribute reads the same value for several consecutive checks (rather
 * than a single fixed delay) so this waits exactly as long as needed —
 * no more, no less — before this test measures the page's resting state
 * instead of a transient frame where `ThemeToggle`'s label briefly
 * renders in the *other* theme's (mismatched, lower-contrast) color.
 */
async function waitForStableTheme(page: Page, theme: string): Promise<void> {
  const requiredConsecutiveMatches = 10;
  const pollIntervalMs = 30; // 10 x 30ms = 300ms of continuous stability required
  const maxAttempts = 100; // 3s ceiling

  let consecutiveMatches = 0;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const current = await page.locator("html").getAttribute("data-theme");
    consecutiveMatches = current === theme ? consecutiveMatches + 1 : 0;
    if (consecutiveMatches >= requiredConsecutiveMatches) return;
    await page.waitForTimeout(pollIntervalMs);
  }
  throw new Error(`data-theme never settled on "${theme}"`);
}

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
        await waitForStableTheme(page, theme);

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
