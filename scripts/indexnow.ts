/**
 * Notifies IndexNow (Bing, Yandex, and other participating search engines)
 * about every URL in the sitemap, so changed/new pages get recrawled
 * without waiting for the next scheduled crawl.
 *
 * Key handling: IndexNow verifies ownership by fetching
 * `https://<host>/<key>.txt` and checking its contents equal `<key>` — so
 * the key used in the request body must always match a real, committed
 * `public/<key>.txt` file (one is committed alongside this script). Reads
 * `INDEXNOW_KEY` from the environment first (so the key can be rotated
 * without a code change — just commit the new `public/<key>.txt` and set
 * the env var to match); if unset, falls back to scanning `public/` for a
 * `<32-hex>.txt` file and using its name as the key.
 *
 * Usage:
 *   pnpm indexnow
 *   INDEXNOW_KEY=<other key already committed as public/<key>.txt> pnpm indexnow
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/lib/site";
import sitemap from "@/app/sitemap";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_FILE_PATTERN = /^[0-9a-f]{32}\.txt$/;

function resolveKey(): string {
  const envKey = process.env.INDEXNOW_KEY;
  if (envKey) return envKey;

  const publicDir = join(process.cwd(), "public");
  const keyFile = readdirSync(publicDir).find((f) => KEY_FILE_PATTERN.test(f));
  if (!keyFile) {
    throw new Error(
      "No INDEXNOW_KEY env var set, and no committed <32-hex>.txt IndexNow key file found under public/.",
    );
  }
  return keyFile.replace(/\.txt$/, "");
}

async function main() {
  const key = resolveKey();
  const host = new URL(site.url).host;
  const keyLocation = `${site.url}/${key}.txt`;
  const urlList = sitemap().map((entry) => entry.url);

  if (urlList.length === 0) {
    throw new Error("Sitemap produced zero URLs — refusing to submit an empty urlList.");
  }

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation, urlList }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `IndexNow submission failed: ${response.status} ${response.statusText}${body ? ` — ${body}` : ""}`,
    );
  }

  console.log(
    `IndexNow: submitted ${urlList.length} URL(s) for ${host} (HTTP ${response.status}).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
