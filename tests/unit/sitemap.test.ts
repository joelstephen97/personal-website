import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { site } from "@/lib/site";

describe("sitemap", () => {
  it("excludes /lab (hidden for launch — the route stays live but out of the sitemap)", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(urls).not.toContain(`${site.url}/lab`);
    expect(urls.some((url) => url.endsWith("/lab"))).toBe(false);
  });

  it("still includes the other static routes", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    for (const path of ["/", "/work", "/experience", "/consulting", "/about", "/now"]) {
      expect(urls).toContain(`${site.url}${path}`);
    }
  });
});
