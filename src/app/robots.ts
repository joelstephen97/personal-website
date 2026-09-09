import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const host = new URL(site.url).host;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dev/", "/api/"] },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host,
  };
}
