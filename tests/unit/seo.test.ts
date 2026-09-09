import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";
import { getProject, getServices } from "@/lib/content";

const scamshield = getProject("scamshield")!;
const serviceWithPage = getServices().find((s) => s.slug !== null)!;

describe("pageMetadata", () => {
  it("builds an absolute canonical URL", () => {
    const meta = pageMetadata({
      title: "Home",
      description: "Full-Stack & AI Product Engineer",
      path: "/",
    });
    expect(meta.alternates?.canonical).toBe(`${site.url}/`);
  });

  it("builds an absolute canonical URL for a nested path", () => {
    const meta = pageMetadata({
      title: "ScamShield",
      description: "On-device scam and phishing detection.",
      path: "/work/scamshield",
    });
    expect(meta.alternates?.canonical).toBe(`${site.url}/work/scamshield`);
  });

  it("sets title, description, and open graph fields", () => {
    const meta = pageMetadata({
      title: "ScamShield",
      description: "On-device scam and phishing detection.",
      path: "/work/scamshield",
    });
    expect(meta.title).toBe("ScamShield");
    expect(meta.description).toBe("On-device scam and phishing detection.");
    const og = meta.openGraph as Record<string, unknown>;
    expect(og.type).toBe("website");
    expect(og.url).toBe(`${site.url}/work/scamshield`);
    expect(og.siteName).toBe(site.name);
    expect(Array.isArray(og.images)).toBe(true);
  });

  it("defaults the open graph image to the /api/og route with encoded title", () => {
    const meta = pageMetadata({
      title: "ScamShield",
      description: "On-device scam and phishing detection.",
      path: "/work/scamshield",
    });
    const og = meta.openGraph as { images: Array<{ url: string } | string> };
    const image = og.images[0];
    const url = typeof image === "string" ? image : image!.url;
    expect(url).toContain("/api/og?");
    expect(url).toContain(`title=${encodeURIComponent("ScamShield")}`);
  });

  it("respects an explicit image override", () => {
    const meta = pageMetadata({
      title: "ScamShield",
      description: "desc",
      path: "/work/scamshield",
      image: "/work/scamshield/hero.png",
    });
    const og = meta.openGraph as { images: Array<{ url: string } | string> };
    const image = og.images[0];
    const url = typeof image === "string" ? image : image!.url;
    expect(url).toBe("/work/scamshield/hero.png");
  });

  it("sets twitter card to summary_large_image", () => {
    const meta = pageMetadata({ title: "Home", description: "desc", path: "/" });
    const twitter = meta.twitter as Record<string, unknown>;
    expect(twitter.card).toBe("summary_large_image");
  });

  it("sets article open graph type when requested", () => {
    const meta = pageMetadata({
      title: "A post",
      description: "desc",
      path: "/writing/a-post",
      type: "article",
    });
    const og = meta.openGraph as Record<string, unknown>;
    expect(og.type).toBe("article");
  });

  it("omits robots by default", () => {
    const meta = pageMetadata({ title: "Home", description: "desc", path: "/" });
    expect(meta.robots).toBeUndefined();
  });

  it("sets robots noindex/nofollow when noindex is true", () => {
    const meta = pageMetadata({
      title: "Résumé",
      description: "desc",
      path: "/resume",
      noindex: true,
    });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});

describe("jsonLdGraph", () => {
  it("returns an @context and @graph", () => {
    const graph = jsonLdGraph({ path: "/", kind: "home" });
    expect(graph).toHaveProperty("@context", "https://schema.org");
    expect(Array.isArray((graph as { "@graph": unknown[] })["@graph"])).toBe(true);
  });

  it("includes a Person with a stable @id and the site job title on the home graph", () => {
    const graph = jsonLdGraph({ path: "/", kind: "home" }) as {
      "@graph": Record<string, unknown>[];
    };
    const person = graph["@graph"].find((n) => n["@type"] === "Person")!;
    expect(person["@id"]).toBe(`${site.url}/#joel`);
    expect(person.jobTitle).toBe(site.title);
    expect(person.alternateName).toBe("Joel Thomas Stephen");
    expect(person.sameAs).toEqual(
      expect.arrayContaining([
        site.github,
        site.linkedin,
        "https://chromewebstore.google.com/detail/fojjjofjimbfoddafoampojopijnlihl",
      ]),
    );
  });

  it("includes a WebSite entity that publishes to the Person", () => {
    const graph = jsonLdGraph({ path: "/", kind: "home" }) as {
      "@graph": Record<string, unknown>[];
    };
    const website = graph["@graph"].find((n) => n["@type"] === "WebSite")!;
    expect(website["@id"]).toBe(`${site.url}/#website`);
    expect((website.publisher as { "@id": string })["@id"]).toBe(`${site.url}/#joel`);
  });

  it("never emits FAQPage or seeks anywhere in the graph", () => {
    for (const page of [
      { path: "/", kind: "home" as const },
      { path: "/consulting", kind: "consulting" as const },
      {
        path: `/consulting/${serviceWithPage.slug}`,
        kind: "service" as const,
        service: serviceWithPage,
      },
      { path: "/work/scamshield", kind: "case" as const, project: scamshield },
      {
        path: "/writing/example",
        kind: "article" as const,
        article: { title: "Example", date: "2026-01-01", summary: "Summary" },
      },
    ]) {
      const serialized = JSON.stringify(jsonLdGraph(page));
      expect(serialized).not.toContain("FAQPage");
      expect(serialized).not.toContain("seeks");
    }
  });

  it("adds a consulting Organization with makesOffer on home/consulting/service kinds", () => {
    const graph = jsonLdGraph({ path: "/", kind: "home" }) as {
      "@graph": Record<string, unknown>[];
    };
    const org = graph["@graph"].find((n) => n["@type"] === "Organization")!;
    expect(org["@id"]).toBe(`${site.url}/#consulting`);
    expect(org.name).toBe("Joel Stephen — AI product consulting");
    expect((org.founder as { "@id": string })["@id"]).toBe(`${site.url}/#joel`);
    expect(org.areaServed).toBe("Abu Dhabi, UAE");
    expect(Array.isArray(org.makesOffer)).toBe(true);
    expect((org.makesOffer as unknown[]).length).toBeGreaterThan(0);
  });

  it("case graph includes a CreativeWork with the case study's url", () => {
    const graph = jsonLdGraph({
      path: "/work/scamshield",
      kind: "case",
      project: scamshield,
    }) as { "@graph": Record<string, unknown>[] };
    const work = graph["@graph"].find((n) => n["@type"] === "CreativeWork")!;
    expect(work.url).toBe(`${site.url}/work/scamshield`);
    expect(work.name).toBe(scamshield.title);
    expect(work.headline).toBe(scamshield.tagline);
    expect((work.author as { "@id": string })["@id"]).toBe(`${site.url}/#joel`);
  });

  it("scamshield case graph includes a SoftwareApplication", () => {
    const graph = jsonLdGraph({
      path: "/work/scamshield",
      kind: "case",
      project: scamshield,
    }) as { "@graph": Record<string, unknown>[] };
    const app = graph["@graph"].find((n) => n["@type"] === "SoftwareApplication")!;
    expect(app).toBeDefined();
    expect(app.name).toBe("ScamShield");
    expect(app.applicationCategory).toBe("BrowserApplication");
    expect(app.operatingSystem).toBe("Chrome");
    expect(app.installUrl).toBe(
      "https://chromewebstore.google.com/detail/fojjjofjimbfoddafoampojopijnlihl",
    );
  });

  it("a non-scamshield case graph has no SoftwareApplication", () => {
    const processDiscovery = getProject("process-discovery")!;
    const graph = jsonLdGraph({
      path: "/work/process-discovery",
      kind: "case",
      project: processDiscovery,
    }) as { "@graph": Record<string, unknown>[] };
    expect(graph["@graph"].find((n) => n["@type"] === "SoftwareApplication")).toBeUndefined();
  });

  it("service graph includes a BreadcrumbList with two items", () => {
    const graph = jsonLdGraph({
      path: `/consulting/${serviceWithPage.slug}`,
      kind: "service",
      service: serviceWithPage,
    }) as { "@graph": Record<string, unknown>[] };
    const breadcrumb = graph["@graph"].find((n) => n["@type"] === "BreadcrumbList")!;
    expect(breadcrumb).toBeDefined();
    const items = breadcrumb.itemListElement as unknown[];
    expect(items.length).toBe(2);
  });

  it("case graph includes a BreadcrumbList with two items", () => {
    const graph = jsonLdGraph({
      path: "/work/scamshield",
      kind: "case",
      project: scamshield,
    }) as { "@graph": Record<string, unknown>[] };
    const breadcrumb = graph["@graph"].find((n) => n["@type"] === "BreadcrumbList")!;
    const items = breadcrumb.itemListElement as unknown[];
    expect(items.length).toBe(2);
  });

  it("article graph includes a BlogPosting and a BreadcrumbList", () => {
    const graph = jsonLdGraph({
      path: "/writing/example",
      kind: "article",
      article: { title: "Example post", date: "2026-01-01", summary: "Summary" },
    }) as { "@graph": Record<string, unknown>[] };
    const post = graph["@graph"].find((n) => n["@type"] === "BlogPosting")!;
    expect(post.headline).toBe("Example post");
    expect(post.datePublished).toBe("2026-01-01");
    expect((post.author as { "@id": string })["@id"]).toBe(`${site.url}/#joel`);
    const breadcrumb = graph["@graph"].find((n) => n["@type"] === "BreadcrumbList")!;
    expect((breadcrumb.itemListElement as unknown[]).length).toBe(2);
  });

  it("home graph has no Organization makesOffer duplication and stays free of case/article types", () => {
    const graph = jsonLdGraph({ path: "/", kind: "home" }) as {
      "@graph": Record<string, unknown>[];
    };
    expect(graph["@graph"].find((n) => n["@type"] === "CreativeWork")).toBeUndefined();
    expect(graph["@graph"].find((n) => n["@type"] === "BlogPosting")).toBeUndefined();
  });
});

describe("JsonLd component", () => {
  it("renders a script tag with escaped JSON-LD", () => {
    const { container } = render(JsonLd({ data: { "@context": "https://schema.org", a: "<b>" } }));
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(script!.innerHTML).toContain("\\u003cb>");
    expect(script!.innerHTML).not.toContain("<b>");
  });
});
