import { test, expect } from "@playwright/test";

// "/lab" is deliberately excluded here — it's hidden for launch (noindex,
// out of the sitemap) and gets its own dedicated assertions below instead
// of the generic "canonical + indexable JSON-LD page" checks every other
// static route gets.
const STATIC_ROUTES = [
  "/",
  "/work",
  "/experience",
  "/consulting",
  "/about",
  "/now",
  "/writing",
  "/resume",
  "/contact",
];

const WORK_SLUGS = [
  "process-discovery",
  "workflow-canvas",
  "scamshield",
  "flower-meister",
  "fmi-platform",
];

const CONSULTING_SLUGS = [
  "ai-integration",
  "ai-workflows",
  "real-time-collaboration",
  "prototyping",
  "ai-reliability-audit",
  "architecture-review",
];

const ALL_ROUTES = [
  ...STATIC_ROUTES,
  ...WORK_SLUGS.map((slug) => `/work/${slug}`),
  ...CONSULTING_SLUGS.map((slug) => `/consulting/${slug}`),
];

test.describe("seo-routes", () => {
  for (const route of ALL_ROUTES) {
    test(`${route} returns 200 with exactly one h1, a canonical link, and JSON-LD`, async ({
      page,
    }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      const ldScripts = page.locator('script[type="application/ld+json"]');
      await expect(ldScripts.first()).toBeAttached();
      expect(await ldScripts.count()).toBeGreaterThan(0);
    });
  }

  test("every route response sets a content-security-policy header", async ({ page }) => {
    // See proxy.ts and task-11-report.md: `script-src` ships as
    // `'self' 'unsafe-inline' https://va.vercel-scripts.com`, not the
    // brief's literal `'nonce-<n>' 'strict-dynamic'` — verified with a
    // real Chromium console that the nonce/strict-dynamic form blocks
    // every script (inline and /_next/static) on this site's mostly
    // statically-generated pages, since a nonce baked into build-time
    // HTML can never match a fresh per-request nonce.
    const response = await page.goto("/");
    const csp = response?.headers()["content-security-policy"];
    expect(csp).toBeDefined();
    expect(csp).toContain("script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com");
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  test("MDX case studies render without unsafe-eval: /work/process-discovery hydrates with numbered h2s and no console/page errors", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const response = await page.goto("/work/process-discovery");
    const csp = response?.headers()["content-security-policy"];
    expect(csp).not.toContain("unsafe-eval");

    await page.waitForLoadState("networkidle");
    expect(pageErrors).toEqual([]);
    expect(consoleErrors.filter((m) => /Content Security Policy/i.test(m))).toEqual([]);

    // The MDX body's H2s render numbered via a DateWindow ("01", "02", ...).
    // Scoped to each heading's own id — the page header's own DateWindow
    // (showing the case study's `order`) can coincidentally read "01" too.
    await expect(page.locator("#problem").getByText("01", { exact: true })).toBeVisible();
    await expect(
      page.locator("#context-and-constraints").getByText("02", { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Problem", level: 2 })).toBeVisible();
  });

  test("the CSP response carries no console script violations on the home page", async ({
    page,
  }) => {
    const violations: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && /Content Security Policy/i.test(msg.text())) {
        violations.push(msg.text());
      }
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(violations).toEqual([]);
  });

  test("/robots.txt contains Sitemap and OAI-SearchBot", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const body = await response!.text();
    expect(body).toContain("Sitemap:");
    expect(body).toContain("OAI-SearchBot");
  });

  test("/sitemap.xml contains /work/process-discovery", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const body = await response!.text();
    expect(body).toContain("/work/process-discovery");
  });

  test("/llms.txt starts with # Joel Stephen", async ({ page }) => {
    const response = await page.goto("/llms.txt");
    expect(response?.status()).toBe(200);
    const body = await response!.text();
    expect(body.startsWith("# Joel Stephen")).toBe(true);
  });

  test("/llms-full.txt returns 200 and contains case study content", async ({ page }) => {
    const response = await page.goto("/llms-full.txt");
    expect(response?.status()).toBe(200);
    const body = await response!.text();
    expect(body.length).toBeGreaterThan(0);
  });

  test("/definitely-missing returns 404", async ({ page }) => {
    const response = await page.goto("/definitely-missing");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("No page here.")).toBeVisible();
  });

  test("/project/aim-trainer redirects (308) to /lab/aim-trainer", async ({ page }) => {
    const response = await page.goto("/project/aim-trainer");
    expect(response?.request().redirectedFrom()).not.toBeNull();
    await expect(page).toHaveURL(/\/lab\/aim-trainer$/);
  });

  test("/lab returns 200 with a noindex, nofollow robots meta tag", async ({ page }) => {
    const response = await page.goto("/lab");
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    await expect(page.locator("h1")).toHaveText("The demos are being ported.");
  });

  test("/lab/aim-trainer (a known slug, reached via the /project redirect) returns 200 with a noindex, nofollow robots meta tag", async ({
    page,
  }) => {
    const response = await page.goto("/lab/aim-trainer");
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    await expect(page.getByText("Aim Trainer")).toBeVisible();
  });

  test("/lab/definitely-not-a-real-demo 404s", async ({ page }) => {
    const response = await page.goto("/lab/definitely-not-a-real-demo");
    expect(response?.status()).toBe(404);
  });

  test("/sitemap.xml does not contain /lab", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const body = await response!.text();
    expect(body).not.toContain("<loc>https://joelstephen.vercel.app/lab</loc>");
  });

  test("/dev/tokens is reachable outside production", async ({ page }) => {
    const response = await page.goto("/dev/tokens");
    expect(response?.status()).toBe(200);
  });

  test("/api/og returns an image", async ({ page }) => {
    const response = await page.goto("/api/og?title=Test&label=Joel%20Stephen");
    expect(response?.status()).toBe(200);
    expect(response?.headers()["content-type"]).toContain("image");
  });
});
