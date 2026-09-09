import type { Metadata } from "next";
import { getDomains, getServices } from "@/lib/content";
import { site } from "@/lib/site";
import type { Project, Service } from "@/content/schema";

const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/fojjjofjimbfoddafoampojopijnlihl";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  noindex?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  image,
  noindex = false,
}: PageMetadataInput): Metadata {
  const canonical = `${site.url}${path}`;
  const ogImage =
    image ??
    `${site.url}/api/og?title=${encodeURIComponent(title)}&label=${encodeURIComponent(site.name)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      url: canonical,
      title,
      description,
      images: [ogImage],
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

type ArticleInput = { title: string; date: string; summary: string };

export type JsonLdPage = {
  path: string;
  kind: "home" | "work" | "case" | "consulting" | "service" | "about" | "article" | "experience";
  project?: Project;
  service?: Service;
  article?: ArticleInput;
};

const personId = `${site.url}/#joel`;
const websiteId = `${site.url}/#website`;
const consultingId = `${site.url}/#consulting`;

function idRef(id: string) {
  return { "@id": id };
}

function buildPerson() {
  const knowsAbout = Array.from(new Set(getDomains().flatMap((d) => d.tech)));
  return {
    "@type": "Person",
    "@id": personId,
    name: site.name,
    alternateName: "Joel Thomas Stephen",
    jobTitle: site.title,
    url: site.url,
    email: `mailto:${site.email}`,
    image: `${site.url}/headshot.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Abu Dhabi",
      addressCountry: "AE",
    },
    worksFor: {
      "@type": "Organization",
      name: site.employer.name,
      url: site.employer.url,
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "BITS Pilani, Dubai Campus",
    },
    knowsAbout,
    sameAs: [site.github, site.linkedin, CHROME_STORE_URL],
  };
}

function buildWebsite() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: site.name,
    url: site.url,
    publisher: idRef(personId),
  };
}

function buildConsultingOrganization() {
  const makesOffer = getServices()
    .filter((s) => s.slug !== null)
    .map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title },
    }));
  return {
    "@type": "Organization",
    "@id": consultingId,
    name: "Joel Stephen — AI product consulting",
    founder: idRef(personId),
    areaServed: "Abu Dhabi, UAE",
    makesOffer,
  };
}

function buildCaseWork(project: Project) {
  const url = `${site.url}/work/${project.slug}`;
  const work = {
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    name: project.title,
    headline: project.tagline,
    url,
    author: idRef(personId),
    dateCreated: project.dates.start,
    keywords: project.technologies,
  };

  const nodes: Record<string, unknown>[] = [work];

  if (project.slug === "scamshield") {
    nodes.push({
      "@type": "SoftwareApplication",
      "@id": `${site.url}/work/scamshield#app`,
      name: "ScamShield",
      applicationCategory: "BrowserApplication",
      operatingSystem: "Chrome",
      creator: idRef(personId),
      installUrl: CHROME_STORE_URL,
      url: project.links.github,
    });
  }

  return { nodes, url };
}

function buildBreadcrumb(
  section: { name: string; url: string },
  page: { name: string; url: string },
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: section.name, item: section.url },
      { "@type": "ListItem", position: 2, name: page.name, item: page.url },
    ],
  };
}

function buildBlogPosting(page: JsonLdPage, article: ArticleInput) {
  return {
    "@type": "BlogPosting",
    "@id": `${site.url}${page.path}#post`,
    headline: article.title,
    datePublished: article.date,
    description: article.summary,
    author: idRef(personId),
    publisher: idRef(personId),
  };
}

export function jsonLdGraph(page: JsonLdPage): {
  "@context": string;
  "@graph": Record<string, unknown>[];
} {
  const graph: Record<string, unknown>[] = [buildPerson(), buildWebsite()];

  if (page.kind === "home" || page.kind === "consulting" || page.kind === "service") {
    graph.push(buildConsultingOrganization());
  }

  if (page.kind === "case" && page.project) {
    const { nodes, url } = buildCaseWork(page.project);
    graph.push(...nodes);
    graph.push(
      buildBreadcrumb({ name: "Work", url: `${site.url}/work` }, { name: page.project.title, url }),
    );
  }

  if (page.kind === "service" && page.service) {
    const url = `${site.url}${page.path}`;
    graph.push(
      buildBreadcrumb(
        { name: "Consulting", url: `${site.url}/consulting` },
        { name: page.service.title, url },
      ),
    );
  }

  if (page.kind === "article" && page.article) {
    const url = `${site.url}${page.path}`;
    graph.push(buildBlogPosting(page, page.article));
    graph.push(
      buildBreadcrumb(
        { name: "Writing", url: `${site.url}/writing` },
        { name: page.article.title, url },
      ),
    );
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
