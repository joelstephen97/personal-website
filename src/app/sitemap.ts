import type { MetadataRoute } from "next";
import { statSync } from "node:fs";
import { join } from "node:path";
import { getFeaturedProjects, getServices, getWriting } from "@/lib/content";
import { site } from "@/lib/site";

const STATIC_ROUTES = [
  "/",
  "/work",
  "/experience",
  "/consulting",
  "/about",
  "/now",
  "/lab",
  "/writing",
  "/resume",
  "/contact",
];

const BUILD_DATE = new Date(`${process.env.NEXT_PUBLIC_BUILD_DATE ?? "2026-09-09"}T00:00:00Z`);

/** MDX file mtime for a case study, falling back to the build date if the file can't be read. */
function caseStudyLastModified(slug: string): Date {
  try {
    return statSync(join(process.cwd(), "content", "work", `${slug}.mdx`)).mtime;
  } catch {
    return BUILD_DATE;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: BUILD_DATE,
  }));

  const workEntries: MetadataRoute.Sitemap = getFeaturedProjects().map((project) => ({
    url: `${site.url}/work/${project.slug}`,
    lastModified: caseStudyLastModified(project.slug),
  }));

  const consultingEntries: MetadataRoute.Sitemap = getServices()
    .filter((service) => service.slug !== null)
    .map((service) => ({
      url: `${site.url}/consulting/${service.slug}`,
      lastModified: BUILD_DATE,
    }));

  const writingEntries: MetadataRoute.Sitemap = getWriting().map((post) => ({
    url: `${site.url}/writing/${post._meta.path}`,
    lastModified: BUILD_DATE,
  }));

  return [...staticEntries, ...workEntries, ...consultingEntries, ...writingEntries];
}
