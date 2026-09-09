import { test, expect } from "@playwright/test";

test.describe("shell", () => {
  test("home has exactly one h1", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("skip link focuses #content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to content" });
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#content")).toBeFocused();
  });

  test("Cmd+K opens the palette, 'cons' + Enter navigates to /consulting, Escape closes", async ({
    page,
  }) => {
    await page.goto("/");
    // `PaletteLauncher` (a `pnpm build` bundle-size fix — `CommandPalette`,
    // and `cmdk` with it, used to ship on every route's initial load;
    // now it lazily loads on the first ⌘K/"/" press or Crown click)
    // attaches its window-level keydown listener in a `useEffect`, which
    // only runs after React hydrates. A raw `page.keyboard.press()`
    // fires the instant `goto()` resolves, with none of the actionability
    // wait `page.click()` gets — pressing this literally the instant the
    // page "loads" can race hydration and be silently dropped (confirmed:
    // clicking the equivalent Crown button, which Playwright always waits
    // to be actionable first, never raced in the same scenario). No real
    // user reaches for a keyboard shortcut in under ~100ms of a page
    // appearing, so this waits a beat first — the same margin `click()`
    // gets for free — rather than papering over a dropped keypress with a
    // longer assertion timeout on a dialog that will never open.
    await page.waitForTimeout(200);
    await page.keyboard.press("Meta+k");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.keyboard.type("cons");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/consulting$/);

    await page.keyboard.press("Meta+k");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test.describe("mobile", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("menu button opens the sheet and Tab stays inside it", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: "Open menu" }).click();

      const sheet = page.getByRole("dialog", { name: "Menu" });
      await expect(sheet).toBeVisible();

      // Tab through every focusable element in the sheet, plus one more —
      // focus should never leave the panel.
      const focusableCount = await sheet
        .locator(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        .count();
      for (let i = 0; i < focusableCount + 1; i++) {
        await page.keyboard.press("Tab");
      }
      const activeInSheet = await sheet.evaluate((el) => el.contains(document.activeElement));
      expect(activeInSheet).toBe(true);
    });
  });

  test.describe("theme toggle", () => {
    // `ThemeToggle` is `hidden md:inline-flex` — desktop-only by design
    // (mobile gets `MobileSheet`'s nav instead, with no theme switch; see
    // the identical note in `tests/e2e/a11y.spec.ts`). This test used to
    // pass on the "mobile" project too, but only because of a real CSS
    // bug: `ThemeToggle`'s own base classes carried an unconditional
    // `inline-flex` that beat the caller's `hidden` in Tailwind's
    // generated stylesheet, so the button rendered at every viewport,
    // mobile included. Now that the bug is fixed (see `ThemeToggle.tsx`),
    // the button is genuinely absent on mobile, matching the design
    // intent this test's own scoping should have had all along.
    test.skip(({ isMobile }) => isMobile, "desktop-only: ThemeToggle is hidden below md");

    test("flips data-theme", async ({ page }) => {
      await page.goto("/");
      const html = page.locator("html");
      await expect(html).toHaveAttribute("data-theme", "dark");

      // Case-insensitive: `ThemeToggle`'s aria-label is
      // "Dark theme, switch to light mode" (lowercase "switch" mid-sentence,
      // per the WCAG 2.5.3 Label-in-Name fix in task-12 of the foundation
      // plan) — this regex previously required a capital "Switch" and never
      // matched, timing out on every run regardless of viewport.
      await page.getByRole("button", { name: /Switch to (light|dark) mode/i }).click();
      await expect(html).toHaveAttribute("data-theme", "light");
    });
  });

  test("/work/opus redirects to /work/process-discovery", async ({ page }) => {
    const response = await page.goto("/work/opus");
    expect(response?.request().redirectedFrom()).not.toBeNull();
    await expect(page).toHaveURL(/\/work\/process-discovery$/);
  });
});
