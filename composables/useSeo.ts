const DEFAULT_SITE_URL = "https://joelstephen.vercel.app";

export interface SeoOptions {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
  breadcrumbTitle?: string;
}

export function useSeo(options: SeoOptions) {
  const config = useRuntimeConfig();
  const siteUrl =
    (config.public as { siteUrl?: string }).siteUrl ?? DEFAULT_SITE_URL;
  const route = useRoute();
  const path = options.path ?? route.path;
  const url = path === "/" ? siteUrl : `${siteUrl}${path}`;
  const ogImage = options.ogImage ?? `${siteUrl}/pwa-512x512.png`;

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogType: "website",
    ogUrl: url,
    ogImage,
    twitterCard: "summary_large_image",
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: ogImage,
    robots: options.noIndex ? "noindex, nofollow" : undefined,
  });

  const headLinks: { rel: string; href: string }[] = [
    { rel: "canonical", href: url },
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

  useHead({
    link: headLinks,
    script: scripts.length > 0 ? scripts : undefined,
  });
}
