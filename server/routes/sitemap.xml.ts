const ROUTES = [
  "/",
  "/experience",
  "/project",
  "/contact",
  "/project/bg-remover",
  "/project/aim-trainer",
  "/project/audio-visualizer",
  "/project/color-palette",
  "/project/cron-parser",
  "/project/eye-dropper",
  "/project/game-of-life",
  "/project/hash-generator",
  "/project/image-captioning",
  "/project/json-diff",
  "/project/local-file-editor",
  "/project/markdown-previewer",
  "/project/pathfinding-visualizer",
  "/project/rainbow-6-randomizer",
  "/project/regex-tester",
  "/project/screen-capture",
  "/project/sorting-visualizer",
  "/project/speech-to-text",
];

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl as string;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(
  (path) => `  <url>
    <loc>${siteUrl}${path === "/" ? "" : path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === "/" ? "1.0" : path === "/project" ? "0.9" : "0.8"}</priority>
  </url>`
).join("\n")}
</urlset>`;

  setResponseHeader(event, "Content-Type", "application/xml");
  setResponseHeader(event, "Cache-Control", "public, max-age=3600");
  return xml;
});
