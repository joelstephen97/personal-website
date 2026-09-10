import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Resolves the woff2 file paths for the "base Latin" subset of Bodoni
 * Moda and Geist — the two font families visible above the fold on every
 * route (the display h1 in Bodoni, body text in Geist) — so `layout.tsx`
 * can emit `<link rel="preload">` for them by hand.
 *
 * Why this exists: under `cacheComponents` (Partial Prerendering), Next's
 * own automatic font-preload injection (normally driven by
 * `.next/server/next-font-manifest.json` during the root layout's
 * render) does not make it into the static shell — confirmed by curling
 * a production build (`pnpm build && pnpm start`) and finding zero
 * `<link rel="preload" as="font">` tags anywhere in the response.
 * Without a preload hint, the browser only discovers these fonts once it
 * has parsed the CSS that `@font-face`-declares them, itself only
 * reachable after the render-blocking stylesheet loads; under
 * Lighthouse's simulated mobile throttling this pushed the Largest
 * Contentful Paint (the hero's proof paragraph, rendered in Geist) to a
 * render delay of ~88% of a 3.8s LCP (see task-5-report.md, "Before").
 *
 * Approach: read the generated CSS chunk(s) under `.next/static/chunks`
 * for `@font-face` rules and pick the "base Latin" declaration per
 * family — the one covering the standard Google Fonts "latin" subset,
 * fingerprinted by its unicode-range ending in the fixed
 * `U+2212,U+2215,U+FEFF,U+FFFD` tail every Google-served Latin font
 * shares (verified against this build's actual CSS output). This is the
 * same file `next-font-manifest.json` marks preload-worthy (its
 * "-s.p." filename suffix) — reading the CSS directly instead of the
 * manifest additionally recovers which family each file belongs to,
 * since the manifest itself is just a flat filename list with no
 * family/style attribution.
 */

const BASE_LATIN_UNICODE_RANGE_TAIL = "U+2212,U+2215,U+FEFF,U+FFFD";
const FONT_FACE_RE =
  /@font-face\{font-family:([^;]+);font-style:([^;]+);font-weight:[^;]+;font-display:swap;src:url\(([^)]+)\)format\("woff2"\);unicode-range:([^}]+)\}/g;

/** Only these families render above the fold on every route; Cinzel (eyebrow labels) and Geist Mono (meta text) are lower-priority and left to normal discovery. */
const PRELOAD_FAMILIES = new Set(["Bodoni Moda", "Geist"]);

export interface FontPreloadLink {
  href: string;
  family: string;
  style: string;
}

let cached: FontPreloadLink[] | null = null;

function resolveCssChunkPaths(): string[] {
  const chunkDir = join(process.cwd(), ".next", "static", "chunks");
  let entries: string[];
  try {
    entries = readdirSync(chunkDir);
  } catch {
    return [];
  }
  return entries.filter((f) => f.endsWith(".css")).map((f) => join(chunkDir, f));
}

/**
 * Above-the-fold font preload hrefs: one per (family, style) pair among
 * `PRELOAD_FAMILIES`, deduped, sorted for a stable link order. Returns
 * `[]` (never throws) if `.next/static/chunks` isn't present yet (e.g.
 * `next dev`, or this module evaluated before build assets are emitted)
 * — a missing preload hint degrades to the browser's normal (slower)
 * font discovery, not a broken page.
 */
export function getFontPreloadLinks(): FontPreloadLink[] {
  if (cached) return cached;

  const links: FontPreloadLink[] = [];
  const seen = new Set<string>();

  for (const path of resolveCssChunkPaths()) {
    let css: string;
    try {
      css = readFileSync(path, "utf8");
    } catch {
      continue;
    }

    const re = new RegExp(FONT_FACE_RE.source, "g");
    let match: RegExpExecArray | null;
    while ((match = re.exec(css))) {
      const [, family, style, url, range] = match;
      if (!family || !style || !url || !range) continue;
      if (!PRELOAD_FAMILIES.has(family)) continue;
      if (!range.trim().endsWith(BASE_LATIN_UNICODE_RANGE_TAIL)) continue;

      const fileName = url.split("/").pop();
      if (!fileName) continue;
      const key = `${family}:${style}`;
      if (seen.has(key)) continue;
      seen.add(key);
      links.push({ href: `/_next/static/media/${fileName}`, family, style });
    }
  }

  links.sort((a, b) => (a.href < b.href ? -1 : 1));
  cached = links;
  return links;
}
