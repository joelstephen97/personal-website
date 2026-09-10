# personal-website

Joel Stephen's portfolio: https://joelstephen.vercel.app. Full-Stack & AI Product Engineer, Abu Dhabi. Case studies, a consulting offer, and a résumé — no chat agent, no PWA, no client-side ML demos.

![Next.js](https://img.shields.io/badge/Next.js-16-000000) ![License](https://img.shields.io/badge/license-MIT-green)

This is the Next.js 16 rewrite of the site on `redesign/next`. Production (`main`) still serves the previous Nuxt 3 build until the launch checklist at the bottom of this file runs.

## Stack

- Next.js 16.3.4, App Router, React 19.2.8, React Server Components for every page; client islands only where a component needs interactivity.
- TypeScript 5.9 (strict), Tailwind CSS 4.3.3 via `@tailwindcss/postcss`.
- Motion 13.2.0 (`motion/react`) — `LazyMotion` + `m.*` components, `MotionConfig reducedMotion="user"`; native View Transitions for the work filter and route changes.
- Fonts via `next/font`: Bodoni Moda (display, static 500 instances in `src/fonts/`), Cinzel (labels), Geist and Geist Mono.
- Content: Zod-typed TypeScript for structured content, MDX via content-collections for long-form (core 0.15.2, `@content-collections/next` 0.2.11, `@content-collections/mdx` 0.2.2).
- next-themes 0.4.6 (dark default, light available), cmdk 1.1.1 (command palette), lucide-react.
- Vitest 5 + Testing Library + jsdom for unit tests, Playwright 1.63 + `@axe-core/playwright` for e2e/accessibility, ESLint 9 + Prettier 3.
- pnpm 10, Node 22.

## Scripts

```bash
pnpm dev              # dev server
pnpm build            # tokens build + next build
pnpm start            # serve the production build
pnpm tokens           # compile tokens/*.json to CSS custom properties
pnpm content-collections  # build the MDX/content-collections cache
pnpm lint             # eslint + prettier --check
pnpm format           # prettier --write
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest run
pnpm test:watch       # vitest watch mode
pnpm e2e              # playwright test (desktop + mobile, axe on every route)
pnpm lhci             # Lighthouse CI against a production build
pnpm measure          # gzipped client JS per route (budget: / <= 230 kB)
pnpm resume:pdf       # print /resume to public/joel-stephen-resume.pdf (needs pnpm start)
pnpm indexnow         # tell IndexNow (Bing, Yandex, Naver, Seznam) the sitemap URLs changed
```

`scripts/instance-bodoni.py` (Python, fontTools + brotli) cuts the static Bodoni Moda instances in `src/fonts/` from Google's variable files; see the docstring.

## Content model

No copy lives inside components. Two sources:

- `src/content/*.ts` — structured content (profile, domains, experience, projects, services, testimonials, now, principles) as Zod-validated TypeScript objects, defined in `src/content/schema.ts`.
- `content/work/*.mdx`, `content/writing/*.mdx` — long-form case studies and posts, compiled by content-collections (`content-collections.ts`) into typed objects with extracted headings and heading-id anchors for the in-page nav.

Both are read through `src/lib/content.ts` so pages never import a content source directly.

## Design tokens

`tokens/*.tokens.json` (DTCG format: color ramps, semantic aliases, spacing/radius/motion/type scale) is the single source of truth. `pnpm tokens` (`scripts/build-tokens.ts`) compiles it to CSS custom properties consumed by Tailwind 4's `@theme inline`; `pnpm build` runs this automatically before `next build`. Never hand-edit generated CSS variables — edit the JSON and rebuild.

`/dev/tokens` is a live reference (palette, scale, type, motion) for every token, gated to non-production: it 404s when `VERCEL_ENV === "production"`, so it's visible on preview deploys and local dev but not on the live site.

## Tests

- `tests/unit/*.test.{ts,tsx}` (Vitest + jsdom): tokens, content, motion primitives, movement components, SEO helpers, MDX components, contrast ratios.
- `tests/e2e/*.spec.ts` (Playwright, desktop and mobile projects): shell/navigation, home choreography and the System Map filter, SEO routes (sitemap, robots, llms.txt, OG, redirects, Lab noindex), the client JS budget, and `pages.spec.ts`, which walks every route for one h1, no skipped heading levels, zero axe violations in both themes, no horizontal overflow at 360 px, and at most three champagne accents in the first viewport.
- `lighthouserc.json` (Lighthouse CI, mobile emulation, 3 runs against `/`, `/work/process-discovery`, `/consulting`, `/experience`, `/about`): performance ≥ 0.95, accessibility ≥ 0.98, best-practices ≥ 0.95, seo ≥ 0.98 as hard errors; `total-byte-weight` warns above 600 kB. Accessibility and SEO score 1.0 on every URL; performance sits at 0.92 to 0.94 for the reason given under Deferred, so `pnpm lhci` currently reports that one assertion as failing on purpose rather than the gate being lowered.

## Deploy

Vercel, connected to this GitHub repo. Production builds `main` with the Nuxt framework preset (unchanged until this branch ships); this branch carries its own `vercel.json` (`{ "framework": "nextjs" }`) so its preview deployments build correctly under the Next.js preset without touching the project's production settings. No custom domain — the app stays on `joelstephen.vercel.app`.

## SEO and AI search

- `src/lib/seo.ts`: `pageMetadata()` builds title/description/canonical/Open Graph/Twitter for every route; `jsonLdGraph()` emits one `@graph` per page (Person `#joel`, WebSite, Organization `#consulting`, CreativeWork per case study, SoftwareApplication for ScamShield, BreadcrumbList). No FAQPage or HowTo markup: Google stopped showing those rich results.
- `src/app/sitemap.ts` lists every indexable route (Lab is excluded until it ships); `src/app/robots.ts` allows search and AI crawlers and disallows `/dev/` and `/api/`.
- `src/app/llms.txt` and `llms-full.txt` are route handlers rendered from the same content modules as the pages, so what an assistant reads is what a visitor reads.
- `src/app/api/og` renders the Open Graph image with Satori using the static TTF instances in `public/fonts/`.
- `public/<key>.txt` + `scripts/indexnow.ts` implement IndexNow. Google is notified through Search Console (see the launch checklist).
- Redirects from the old site live in `next.config.ts` (`/project/*` to `/lab/*`, `/work/opus` to `/work/process-discovery`).

## Security

`src/proxy.ts` sets the Content-Security-Policy and the other security headers on every response. `script-src` is `'self' 'unsafe-inline' https://va.vercel-scripts.com`: Next.js inlines its hydration and RSC payload scripts, and a nonce-based policy would force every page to render dynamically, which this static-first site does not want. There is no `'unsafe-eval'` (MDX is compiled at build time and rendered on the server). A hash-based policy is on the deferred list. `/dev/tokens` returns 404 when `VERCEL_ENV` is `production`.

## Deferred

Called out in the redesign blueprint but deliberately not in this launch:

- **Case-study chrome** (Joel, 2026-09-10: "hold off on the case study and do this later"): skeleton architecture diagrams drawn on scroll, the 8-second push-in hero with grain, a scroll-linked reading dial on `/work/<slug>`, and a redesigned prev/next control. Case studies keep the current template; ScamShield's page got content-only additions instead (`src/components/work/ScamShieldExtras.tsx`, `src/content/scamshield-facts.ts`).
- **Lab port**: `/lab` and `/lab/[slug]` stay routable so the old `/project/*` redirects land on a 200, but render a short noindex "the demos are being ported" page. `src/content/lab.ts` keeps all 19 demos in three tiers (port / later / retire). Lab is hidden from the nav, the command palette, the home page, the sitemap and `llms.txt` until it ships.
- **Motion `mini` migration**: Motion's React entry costs about 43 kB gzipped on every route. Moving the simple reveals to `motion/mini` or CSS would cut most of it and is the documented path to a Lighthouse performance score of 0.95 or above (currently 0.92 to 0.94 on mobile; the gap is simulated download time of client JS, not a rendering problem: real LCP is under 200 ms on a fast connection, TBT under 30 ms, CLS 0).
- **Hash-based CSP** replacing `'unsafe-inline'` on `script-src`.
- **Writing**: `content/writing/*.mdx` is wired up but the section only appears in the nav once two posts exist.

## Launch checklist

The branch is verified on its Vercel preview; production still serves the Nuxt build from `main` until these steps run.

1. Merge `redesign/next` into `main` with a merge commit and push. Vercel builds `main` with `vercel.json` (`framework: nextjs`).
2. Verify production: `<title>` on `/`, `/robots.txt`, `/sitemap.xml` (no `/lab`), the `Content-Security-Policy` header, `/dev/tokens` returns 404, `/api/og?title=…` renders, `/project/aim-trainer` redirects to `/lab/aim-trainer`, `/work/opus` redirects to `/work/process-discovery`, `/joel-stephen-resume.pdf` is the regenerated file.
3. Google Search Console: submit `https://joelstephen.vercel.app/sitemap.xml`, request indexing for `/`, `/consulting`, `/about`. Bing Webmaster Tools: import from Search Console. Run `pnpm indexnow`.
4. Update the LinkedIn headline and the GitHub profile to "Full-Stack & AI Product Engineer" with the site URL.
5. Delete the `feat/motion-v-migration` and `gh-pages` branches if nothing uses them.

## No chat agent

Earlier versions of this site (Nuxt) had a Groq-backed "ask about Joel" chat widget. This rewrite drops it, along with the PWA install prompt and the in-browser ML demos — the site is now case studies, a consulting page, and a résumé, kept fast and simple on purpose.

## License

MIT, see [LICENSE](LICENSE). The content about Joel (text, images, résumé) is not covered by the license.
