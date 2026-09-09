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

  test("theme toggle flips data-theme", async ({ page }) => {
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

  test("/work/opus redirects to /work/process-discovery", async ({ page }) => {
    const response = await page.goto("/work/opus");
    expect(response?.request().redirectedFrom()).not.toBeNull();
    await expect(page).toHaveURL(/\/work\/process-discovery$/);
  });
});
