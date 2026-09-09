# personal-website

Joel Stephen's portfolio: https://joelstephen.vercel.app. Full-Stack & AI Product Engineer, Abu Dhabi. Case studies, a consulting offer, and a résumé — no chat agent, no PWA, no client-side ML demos.

![Next.js](https://img.shields.io/badge/Next.js-16-000000) ![License](https://img.shields.io/badge/license-MIT-green)

This is the Next.js 16 rewrite of the site on `redesign/next`. Production (`main`) still serves the previous Nuxt 3 build until this branch's acceptance checklist passes.

## Stack

- Next.js 16.3.4, App Router, React 19.2.8, React Server Components for every page; client islands only where a component needs interactivity.
- TypeScript 5.9 (strict), Tailwind CSS 4.3.3 via `@tailwindcss/postcss`.
- Motion 13.2.0 (`motion/react`) — `LazyMotion` + `m.*` components, `MotionConfig reducedMotion="user"`.
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
pnpm e2e              # playwright test
pnpm lhci             # Lighthouse CI against a production build
```

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
- `tests/e2e/*.spec.ts` (Playwright): shell/navigation, SEO routes (sitemap, robots, llms.txt, OG), and `@axe-core/playwright` accessibility checks (zero violations budget on every route).
- `lighthouserc.json` (Lighthouse CI, mobile emulation, 3 runs against `/`, `/work/process-discovery`, `/consulting`): performance ≥ 0.95, accessibility ≥ 0.98, best-practices ≥ 0.95, seo ≥ 0.98 as hard errors; `total-byte-weight` warns above 600 kB.

## Deploy

Vercel, connected to this GitHub repo. Production builds `main` with the Nuxt framework preset (unchanged until this branch ships); this branch carries its own `vercel.json` (`{ "framework": "nextjs" }`) so its preview deployments build correctly under the Next.js preset without touching the project's production settings. No custom domain — the app stays on `joelstephen.vercel.app`.

Security headers and CSP live in `next.config.ts` and `src/proxy.ts` (Next 16's `middleware.ts` replacement); see the comments in `src/proxy.ts` for why the CSP ships `'unsafe-inline'` on `script-src` rather than a nonce (nonce-based CSP is incompatible with the mostly-static rendering this site needs to hit its performance budget).

## Deferred

Two things called out in the redesign but not shipped in this pass:

- **Case-study chrome** — skeleton architecture diagrams drawn on scroll, a push-in hero with grain, a scroll-linked reading dial, and a redesigned prev/next control on `/work/<slug>` pages. Case studies keep the existing template for launch; ScamShield's page got content-only improvements instead (see `src/components/work/ScamShieldExtras.tsx`).
- **Lab port** — `/lab` and `/lab/[slug]` are live (so the old `/project/*` redirects still land on a 200) but render a short noindex "the demos are being ported" placeholder rather than the real tier grid. `src/content/lab.ts` keeps every planned entry for the future port; Lab is hidden from the nav, the command palette, the home page, the sitemap, and `llms.txt`/`llms-full.txt` until it ships.

## No chat agent

Earlier versions of this site (Nuxt) had a Groq-backed "ask about Joel" chat widget. This rewrite drops it, along with the PWA install prompt and the in-browser ML demos — the site is now case studies, a consulting page, and a résumé, kept fast and simple on purpose.

## License

MIT, see [LICENSE](LICENSE). The content about Joel (text, images, résumé) is not covered by the license.
