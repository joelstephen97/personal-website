import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  "/",
  "/work",
  "/work/process-discovery",
  "/work/scamshield",
  "/experience",
  "/consulting",
  "/consulting/ai-integration",
  "/about",
  "/now",
  "/contact",
  "/resume",
  "/lab",
];

const THEMES = ["dark", "light"] as const;

/**
 * See `a11y.spec.ts`'s `waitForStableTheme`: next-themes' React provider
 * briefly resets `data-theme` to `defaultTheme` on mount before settling
 * back to the localStorage-resolved value, at a variable delay. Poll until
 * the attribute reads the same value for several consecutive checks
 * before scanning, so this measures the page's resting state.
 */
async function setThemeAndGoto(page: Page, route: string, theme: (typeof THEMES)[number]) {
  await page.addInitScript((t) => {
    try {
      window.localStorage.setItem("theme", t);
    } catch {
      // ignore — the inline script degrades to the default theme
    }
  }, theme);
  await page.goto(route);
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

  const requiredConsecutiveMatches = 10;
  const pollIntervalMs = 30;
  const maxAttempts = 100;
  let consecutiveMatches = 0;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const current = await page.locator("html").getAttribute("data-theme");
    consecutiveMatches = current === theme ? consecutiveMatches + 1 : 0;
    if (consecutiveMatches >= requiredConsecutiveMatches) return;
    await page.waitForTimeout(pollIntervalMs);
  }
  throw new Error(`data-theme never settled on "${theme}" for ${route}`);
}

/**
 * Walks every heading (`h1`-`h6`) in DOM order and asserts the level
 * sequence never skips a step going down (h1 -> h3 is a violation; h3 -> h1
 * or h3 -> h2, stepping back up or staying level, is always fine per the
 * WCAG 1.3.1 "headings don't skip levels" rule).
 */
async function assertNoHeadingLevelSkips(page: Page) {
  const levels = await page.evaluate(() =>
    Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((el) =>
      Number(el.tagName.slice(1)),
    ),
  );

  let previous = 0;
  for (const level of levels) {
    expect(level, `heading sequence ${JSON.stringify(levels)} skips a level`).toBeLessThanOrEqual(
      previous + 1,
    );
    previous = level;
  }
}

/**
 * Counts "champagne" elements visible in the first viewport, per two OR'd
 * criteria:
 *  - the element's class list contains a *solid* champagne utility token
 *    (`text-champagne`, `bg-champagne`, `bg-champagne-400`, `border-champagne`,
 *    `stroke-champagne`, …) — deliberately excluding the `-line` and `-soft`
 *    suffixed utilities, which resolve to a different, translucent token
 *    (`--metal-champagne-line` / `--metal-champagne-soft`, low-alpha rgba)
 *    that every "spends the champagne budget" comment in the codebase
 *    (`Hero.tsx`, `NowBlock.tsx`, `CredibilityStrip.tsx`, …) treats as a
 *    separate, unlimited hairline/wash material rather than a solid
 *    champagne accent;
 *  - OR the element's computed `color`, `background-color`, or
 *    `border-*-color` equals the *solid* champagne token's resolved rgb.
 *    Tailwind's `@theme inline` block (`globals.css`) means `--color-champagne`
 *    itself is only ever inlined into generated utility rules (e.g.
 *    `.text-champagne{color:var(--metal-champagne)}`) and is never emitted
 *    as a real, queryable custom property — the actual runtime token
 *    (themed per dark/light in `tokens.css`) is `--metal-champagne`, read
 *    here via a probe element so nested `var()` references come back as a
 *    plain `rgb()` string. This catches non-class usages like
 *    `SystemMap`/`StaticMap`'s inline
 *    `style={{ stroke: "var(--metal-champagne)" }}` bezel/core marks.
 * Only elements whose bounding box intersects the viewport count, and
 * nested matches are de-duplicated: an element is only counted if its
 * nearest matching ancestor is not itself already counted.
 */
async function countChampagneInViewport(page: Page): Promise<number> {
  return page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.color = "var(--metal-champagne)";
    document.body.appendChild(probe);
    const solidRgb = getComputedStyle(probe).color;
    probe.remove();

    const CLASS_RE = /(^|-)champagne(-\d+)?$/;

    function hasSolidChampagneClass(el: Element): boolean {
      return Array.from(el.classList).some((cls) => CLASS_RE.test(cls));
    }

    function hasSolidChampagneComputedColor(el: Element): boolean {
      const style = getComputedStyle(el);
      return (
        style.color === solidRgb ||
        style.backgroundColor === solidRgb ||
        style.borderTopColor === solidRgb ||
        style.borderRightColor === solidRgb ||
        style.borderBottomColor === solidRgb ||
        style.borderLeftColor === solidRgb
      );
    }

    function intersectsViewport(el: Element): boolean {
      const rect = el.getBoundingClientRect();
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth
      );
    }

    const matches: Element[] = [];
    for (const el of Array.from(document.body.querySelectorAll("*"))) {
      if (!intersectsViewport(el)) continue;
      if (hasSolidChampagneClass(el) || hasSolidChampagneComputedColor(el)) {
        matches.push(el);
      }
    }

    const matchSet = new Set(matches);
    let count = 0;
    for (const el of matches) {
      let ancestor = el.parentElement;
      let ancestorIsMatch = false;
      while (ancestor) {
        if (matchSet.has(ancestor)) {
          ancestorIsMatch = true;
          break;
        }
        ancestor = ancestor.parentElement;
      }
      if (!ancestorIsMatch) count++;
    }
    return count;
  });
}

test.describe("pages — structure and a11y", () => {
  for (const route of ROUTES) {
    test.describe(route, () => {
      test(`${route}: exactly one h1, no heading level skips`, async ({ page }) => {
        await page.goto(route);
        await expect(page.locator("h1")).toHaveCount(1);
        await assertNoHeadingLevelSkips(page);
      });

      for (const theme of THEMES) {
        test(`${route}: zero axe violations in ${theme} theme`, async ({ page }) => {
          await setThemeAndGoto(page, route, theme);

          if (route === "/") {
            // The hero headline's once-per-load word-stagger choreography
            // transiently renders words at opacity: 0 mid-animation — real,
            // but not permanent. Wait for it to settle first (see
            // a11y.spec.ts / home.spec.ts for the same wait).
            await expect(page.locator("h1 .inline-block").last()).toHaveCSS("opacity", "1");
          }

          const results = await new AxeBuilder({ page }).analyze();
          expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
        });
      }

      test(`${route}: no horizontal overflow at 360px`, async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 800 });
        await page.goto(route);
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollWidth).toBeLessThanOrEqual(360);
      });

      test(`${route}: champagne budget (<=3) in the first 1440x900 viewport`, async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(route);
        const count = await countChampagneInViewport(page);
        expect(count).toBeLessThanOrEqual(3);
      });
    });
  }
});

test.describe("pages — misc", () => {
  test("/joel-stephen-resume.pdf returns 200 with a PDF content type", async ({ request }) => {
    const response = await request.get("/joel-stephen-resume.pdf");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  });

  test("/lab is noindexed", async ({ page }) => {
    await page.goto("/lab");
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", /noindex/);
  });
});
