/**
 * Renders `/resume` to `public/joel-stephen-resume.pdf` with a real browser
 * (print media, A4, CSS page size respected) and asserts it fits the
 * two-page print budget.
 *
 * This script starts nothing itself — it expects the production build to
 * already be running at `http://localhost:3000` (`pnpm build && pnpm
 * start`, in another terminal / backgrounded process). If that's not
 * reachable, it prints instructions and exits 1 rather than guessing at a
 * dev server.
 *
 * Usage:
 *   pnpm build && pnpm start &
 *   pnpm resume:pdf
 */
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";

const BASE_URL = process.env.RESUME_BASE_URL ?? "http://localhost:3000";
const OUT_PATH = path.resolve(process.cwd(), "public/joel-stephen-resume.pdf");
const MAX_PAGES = 2;

async function isServerUp(): Promise<boolean> {
  try {
    const res = await fetch(BASE_URL, { method: "GET" });
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

/**
 * Counts PDF page objects by scanning the raw bytes for `/Type /Page`
 * (not `/Type /Pages`, the page-tree node) — good enough for a
 * single-producer PDF like Playwright's Chromium print output, without
 * pulling in a PDF-parsing dependency.
 */
function countPdfPages(bytes: Buffer): number {
  const text = bytes.toString("latin1");
  const matches = text.match(/\/Type\s*\/Page(?!s)\b/g);
  return matches ? matches.length : 0;
}

async function main() {
  if (!(await isServerUp())) {
    console.error(
      `\nNo server reachable at ${BASE_URL}.\n` +
        `Start the production build first, then re-run this script:\n\n` +
        `  pnpm build && pnpm start\n  pnpm resume:pdf\n`,
    );
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${BASE_URL}/resume`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    path: OUT_PATH,
  });
  await browser.close();

  const bytes = readFileSync(OUT_PATH);
  const pageCount = countPdfPages(bytes);
  console.log(`Wrote ${OUT_PATH} (${(bytes.length / 1024).toFixed(1)} kB, ${pageCount} page(s)).`);

  if (pageCount > MAX_PAGES) {
    console.error(
      `Résumé PDF is ${pageCount} pages — the print layout must fit ${MAX_PAGES}. Trim content or print CSS.`,
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// Exported for potential test reuse of the page-counting logic.
export { countPdfPages };
