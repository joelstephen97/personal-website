import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next 16's `proxy.ts` replaces `middleware.ts`. Two jobs:
 *
 * 1. `/dev/*` 404s in production (belt-and-braces with the
 *    `notFound()` call in `src/app/dev/tokens/page.tsx`), so the
 *    token/component reference never ships to real visitors.
 * 2. Every response gets a per-request nonce (forwarded via `x-nonce`,
 *    for any dynamic route that wants to read it via `headers()`) and a
 *    `Content-Security-Policy` header.
 *
 * `script-src` deliberately ships as
 * `'self' 'unsafe-inline' https://va.vercel-scripts.com`
 * rather than the brief's literal `'nonce-<n>' 'strict-dynamic'` spec. Verified
 * with a real Chromium session (`page.on("console")` against every inline
 * `<script>` and `/_next/static/chunks/*.js` tag on `/`): with the nonce
 * form, EVERY script on the page was blocked — the theme-flash IIFE, every
 * `self.__next_f.push(...)` RSC hydration chunk, and every `/_next/static`
 * chunk load (`'strict-dynamic'` disables `'self'` host-matching, and a
 * `'nonce-x'` token anywhere in the directive disables `'unsafe-inline'`
 * as a fallback, per the CSP3 spec — regardless of whether that request's
 * response actually got HTML with a matching nonce). Next's own docs say
 * why: nonce-based CSP requires per-request dynamic rendering, and is
 * "not compatible with... fully static generation"
 * (https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy).
 * This site is deliberately mostly static (○ in the build output, cached
 * HTML) to hit the Lighthouse-mobile ≥95 / ≤90kB budget in the global
 * constraints — pages Task 11 doesn't get to make dynamic. A nonce
 * embedded in a build-time-cached page can never match the fresh nonce
 * generated on each later request, so the exact spec'd policy is not
 * just "stricter", it is non-functional here. Coordinator ruling
 * (fix round 1): `'unsafe-inline'` is accepted for this static site,
 * hash-based CSP is a later follow-up.
 *
 * `'unsafe-eval'` is NOT in this policy (fix round 1 removed it).
 * `@content-collections/mdx/react`'s `MDXContent` compiles each MDX
 * document to a function body and evaluates it via `new Function(...)`
 * — the package's `package.json` exports a `"react-server"` condition
 * that points this at `dist/react/server.js` when imported from a
 * Server Component (see `src/components/mdx/MdxContent.tsx`, which has
 * no `"use client"`), so that evaluation runs once in Node during the
 * server render, never in the browser. Verified: `/work/[slug]` still
 * hydrates cleanly and renders numbered h2s with this directive
 * dropped, and the page throws no `pageerror`.
 *
 * This is the strictest policy that actually works: same-origin scripts
 * via `'self'`, inline hydration/bootstrap scripts via `'unsafe-inline'`
 * (unavoidable without per-route dynamic rendering), and the Vercel
 * Analytics loader by host. See task-11-report.md for the full
 * verification transcript.
 */
function buildCsp(): string {
  return [
    `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https://avatars.githubusercontent.com`,
    `font-src 'self'`,
    `connect-src 'self' https://va.vercel-insights.com https://vitals.vercel-insights.com`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self' mailto:`,
    `object-src 'none'`,
  ].join("; ");
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dev") && process.env.VERCEL_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }

  // Web Crypto's randomUUID + the standard `btoa` are both available in
  // the Edge runtime `proxy.ts` executes in — no Node `Buffer` needed.
  // Still generated and forwarded every request (see the note on
  // `buildCsp` above for why it isn't wired into `script-src`).
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  // Every route except static assets, the image optimizer, the
  // favicon, and any request for a file with an extension (fonts,
  // images, etc. served from /public).
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)"],
};
