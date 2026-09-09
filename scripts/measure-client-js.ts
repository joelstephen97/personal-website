/**
 * Measures the exact set of JS files a real browser loads for a route's
 * first load, and their gzipped size on disk (matching what a real HTTP
 * response would transfer with gzip/br compression enabled).
 *
 * Usage:
 *   pnpm measure [url] [url...]
 *   (defaults to "/" and "/work/process-discovery" against
 *   http://localhost:3000, started separately via `pnpm build && pnpm start`)
 */
import { chromium } from "@playwright/test";
import { gzipSync } from "node:zlib";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const BASE_URL = process.env.MEASURE_BASE_URL ?? "http://localhost:3000";
const DEFAULT_ROUTES = ["/", "/work/process-discovery"];
const NEXT_DIR = path.resolve(process.cwd(), ".next");

function gzipSizeForUrl(url: string): number | null {
  const u = new URL(url);
  // Map "/_next/static/..." response URLs back to the on-disk file under
  // .next/static/... so we gzip the exact bytes Next.js would serve.
  const marker = "/_next/static/";
  const idx = u.pathname.indexOf(marker);
  if (idx === -1) return null;
  const rel = u.pathname.slice(idx + marker.length);
  const filePath = path.join(NEXT_DIR, "static", rel);
  if (!existsSync(filePath)) return null;
  const bytes = readFileSync(filePath);
  return gzipSync(bytes, { level: 9 }).length;
}

async function measureRoute(url: string) {
  const browser = await chromium.launch();
  // A fresh context has no HTTP cache, so this is already a cold load.
  const context = await browser.newContext();
  const page = await context.newPage();

  const jsUrls = new Set<string>();
  page.on("response", (response) => {
    const u = response.url();
    if (u.endsWith(".js") && response.request().resourceType() === "script") {
      jsUrls.add(u);
    }
  });

  await page.goto(BASE_URL + url, { waitUntil: "networkidle" });
  await context.close();
  await browser.close();

  const rows = [...jsUrls]
    .map((u) => ({ url: u, gzip: gzipSizeForUrl(u) }))
    .filter((r) => r.gzip !== null) as { url: string; gzip: number }[];
  rows.sort((a, b) => b.gzip - a.gzip);
  return rows;
}

async function main() {
  const routes = process.argv.slice(2);
  const targets = routes.length > 0 ? routes : DEFAULT_ROUTES;

  for (const route of targets) {
    console.log(`\n=== ${route} ===`);
    const rows = await measureRoute(route);
    let total = 0;
    for (const row of rows) {
      const name = row.url.split("/_next/static/")[1] ?? row.url;
      console.log(`${(row.gzip / 1024).toFixed(2).padStart(8)} kB  ${name}`);
      total += row.gzip;
    }
    console.log(`--------`);
    console.log(`${(total / 1024).toFixed(2).padStart(8)} kB  TOTAL (${rows.length} files)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
