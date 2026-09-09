import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const NODE_SELECTOR = 'svg[role="group"] [role="button"]';

async function getCardCount(page: Page) {
  return page.locator('article[aria-label^="Case study"]').count();
}

test.describe("home hero — no JS", () => {
  test("h1 and CTAs are visible with no inline opacity:0 in the hero, with JavaScript disabled", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");

    const h1 = page.locator("h1");
    await expect(h1).toContainText("Building AI systems");
    await expect(h1).toBeVisible();

    const hero = page.locator("section").first();
    for (const name of ["Selected work", "Work with me", "Résumé"]) {
      await expect(hero.getByRole("link", { name })).toBeVisible();
    }

    const opacities = await hero.evaluate((el) =>
      Array.from(el.querySelectorAll<HTMLElement | SVGElement>("*")).map(
        (node) => (node as HTMLElement).style?.opacity ?? "",
      ),
    );
    expect(opacities.filter((o) => o === "0")).toHaveLength(0);

    await context.close();
  });
});

test.describe("home — desktop map keyboard filter", () => {
  test.skip(({ isMobile }) => isMobile, "desktop-only: pointer/keyboard map interaction");

  test("ArrowRight moves focus, Enter filters, Escape clears", async ({ page }) => {
    await page.goto("/");

    const nodes = page.locator(NODE_SELECTOR);
    await expect(nodes).toHaveCount(6);

    await nodes.first().focus();
    await expect(nodes.first()).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await expect(nodes.nth(1)).toBeFocused();

    const initialCount = await getCardCount(page);
    expect(initialCount).toBe(5);

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\?domain=/);

    // The filtered-out cards exit via `AnimatePresence`/`spring.gentle`
    // rather than disappearing on the same tick, so wait for the count to
    // settle instead of reading it synchronously.
    await expect(page.locator('article[aria-label^="Case study"]')).not.toHaveCount(5);
    const filteredCount = await getCardCount(page);
    expect(filteredCount).toBeLessThan(5);

    const liveRegion = page.locator('[aria-live="polite"]', { hasText: "Filtering" });
    await expect(liveRegion).toHaveText(/Filtering/);

    await page.keyboard.press("Escape");
    await expect(page).not.toHaveURL(/domain=/);
    await expect(page.locator('article[aria-label^="Case study"]')).toHaveCount(5);
  });
});

test.describe("home — mobile chip filter", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile-only: below-480px chip fallback");

  test("chips are visible, the SVG map is hidden, and tapping a chip filters", async ({ page }) => {
    await page.goto("/");

    const chipGroup = page.getByRole("group", { name: "Filter work by domain" });
    await expect(chipGroup).toBeVisible();
    await expect(page.locator('svg[role="group"]')).toBeHidden();

    await chipGroup.getByRole("button", { name: "Real-Time" }).click();
    await expect(page).toHaveURL(/\?domain=realtime/);
    await expect(page.locator('article[aria-label^="Case study"]')).toHaveCount(1);
  });
});

test.describe("home — reduced motion", () => {
  test.skip(({ isMobile }) => isMobile, "map is hidden below 480px — nothing to assert on mobile");

  test("nodes mount with an identity transform and edges are fully drawn", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const nodes = page.locator(NODE_SELECTOR);
    await expect(nodes).toHaveCount(6);

    const transforms = await nodes.evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).transform),
    );
    for (const transform of transforms) {
      // "none" or the identity matrix — no residual scale/translate from a
      // skipped mount animation.
      if (transform !== "none") {
        expect(transform).toMatch(/^matrix\(1,\s*0,\s*0,\s*1,\s*0,\s*0\)$/);
      }
    }

    const edges = page.locator(".map-edge");
    const edgeCount = await edges.count();
    expect(edgeCount).toBeGreaterThan(0);
    const drawStates = await edges.evaluateAll((els) =>
      els.map((el) => {
        const style = getComputedStyle(el as SVGPathElement);
        return { opacity: style.opacity, dashoffset: style.strokeDashoffset };
      }),
    );
    for (const state of drawStates) {
      expect(state.opacity).toBe("1");
      expect(["", "0px", "0", "auto"]).toContain(state.dashoffset);
    }
  });
});

test.describe("home — direct link to a domain", () => {
  test.skip(({ isMobile }) => isMobile, "asserts the map node's aria-pressed state (desktop only)");

  test("?domain=cv shows only Flower Meister and marks the cv node pressed", async ({ page }) => {
    await page.goto("/?domain=cv");

    await expect(page.locator('article[aria-label^="Case study"]')).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Flower Meister" })).toBeVisible();

    const cvNode = page.locator(`${NODE_SELECTOR}[data-id="cv"]`);
    await expect(cvNode).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("home — accessibility", () => {
  test.skip(({ isMobile }) => isMobile, "hovers the map, which is hidden below 480px");

  test("zero axe violations on / with the first node's tooltip open", async ({ page }) => {
    await page.goto("/");

    // The hero headline's once-per-load word-stagger choreography (~0.7s
    // to the last word) transiently renders words at `opacity: 0`
    // mid-animation — real, but not permanent. Wait for it to settle
    // before scanning contrast so this measures the page's resting state.
    await expect(page.locator("h1 .inline-block").last()).toHaveCSS("opacity", "1");

    const firstNode = page.locator(NODE_SELECTOR).first();
    await firstNode.hover();

    // The visible tooltip panel is a sibling of the map's <svg>, inside the
    // same wrapper — scoped this way so it doesn't collide with the other
    // `.glass` surfaces elsewhere on the page (e.g. LabTeaser's tiles).
    const tooltip = page
      .locator('svg[role="group"]')
      .locator(
        "xpath=following-sibling::*//*[contains(concat(' ', normalize-space(@class), ' '), ' glass ')]",
      );
    await expect(tooltip).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
});

test.describe("/work — map as filter", () => {
  test("renders the compact map (desktop) or chips (mobile), and the archive list", async ({
    page,
  }, testInfo) => {
    await page.goto("/work");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Five things I am proud of",
    );

    if (testInfo.project.name === "mobile") {
      await expect(page.getByRole("group", { name: "Filter work by domain" })).toBeVisible();
    } else {
      await expect(page.locator(NODE_SELECTOR)).toHaveCount(6);
    }

    await expect(page.getByRole("heading", { name: "Everything else" })).toBeVisible();
    const archiveItems = page
      .locator("#archive-heading")
      .locator("xpath=../following-sibling::ul/li");
    expect(await archiveItems.count()).toBeGreaterThan(0);
  });
});
