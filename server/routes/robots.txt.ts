export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl as string;

  const body = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml

# AI crawlers: structured info at /llms.txt
`;

  setResponseHeader(event, "Content-Type", "text/plain; charset=utf-8");
  setResponseHeader(event, "Cache-Control", "public, max-age=3600");
  return body;
});
