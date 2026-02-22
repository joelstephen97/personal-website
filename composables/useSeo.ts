const DEFAULT_SITE_URL = "https://joelstephen.vercel.app";
const SITE_NAME = "Joel Stephen | Software Engineer";
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const OG_IMAGE_ALT = "Joel Stephen - Software Engineer portfolio";

export interface ProjectSchemaOptions {
  name: string;
  description: string;
  datePublished?: string;
}

export interface SeoOptions {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogImageAlt?: string;
  noIndex?: boolean;
  breadcrumbTitle?: string;
  projectSchema?: ProjectSchemaOptions;
}

export function useSeo(options: SeoOptions) {
  const config = useRuntimeConfig();
  const siteUrl =
    (config.public as { siteUrl?: string }).siteUrl ?? DEFAULT_SITE_URL;
  const route = useRoute();
  const path = options.path ?? route.path;
  const url = path === "/" ? siteUrl : `${siteUrl}${path}`;
  const ogImage = options.ogImage ?? `${siteUrl}/og-image.png`;
  const ogImageAlt = options.ogImageAlt ?? OG_IMAGE_ALT;

  const publicConfig = config.public as {
    siteUrl?: string;
    twitterCreator?: string;
    twitterSite?: string;
  };
  const twitterCreator = publicConfig.twitterCreator;
  const twitterSite = publicConfig.twitterSite;

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogType: "website",
    ogUrl: url,
    ogImage,
    ogSiteName: SITE_NAME,
    ogLocale: "en_US",
    twitterCard: "summary_large_image",
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: ogImage,
    ...(twitterCreator && { twitterCreator }),
    ...(twitterSite && { twitterSite }),
    robots: options.noIndex ? "noindex, nofollow" : undefined,
  });

  const headLinks: { rel: string; href: string }[] = [
    { rel: "canonical", href: url },
  ];

  const meta: { property?: string; name?: string; content: string }[] = [
    { property: "og:image:width", content: String(OG_IMAGE_WIDTH) },
    { property: "og:image:height", content: String(OG_IMAGE_HEIGHT) },
    { property: "og:image:alt", content: ogImageAlt },
  ];

  const scripts: { type: string; children: string }[] = [];

  if (options.breadcrumbTitle && path.startsWith("/project/")) {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Projects",
          item: `${siteUrl}/project`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: options.breadcrumbTitle,
          item: url,
        },
      ],
    };
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify(breadcrumbSchema),
    });
  }

  if (options.projectSchema) {
    const softwareSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication" as const,
      name: options.projectSchema.name,
      description: options.projectSchema.description,
      url,
      author: {
        "@type": "Person" as const,
        name: "Joel Stephen",
        url: siteUrl,
      },
      ...(options.projectSchema.datePublished && {
        datePublished: options.projectSchema.datePublished,
      }),
    };
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify(softwareSchema),
    });
  }

  useHead({
    meta,
    link: headLinks,
    script: scripts.length > 0 ? scripts : undefined,
  });
}
