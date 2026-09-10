import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  reactCompiler: true,
  typedRoutes: true,
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Next's default `deviceSizes` jumps 640 -> 750, a 110px gap that's
    // bigger than it looks once a high-DPR mobile emulation is in the
    // mix: the About page's `Headshot` (`sizes="(min-width:1024px) 320px,
    // 60vw"`) computes a ~649px physical target at Lighthouse's mobile
    // profile (412px viewport x 2.625 DPR), which is just over 640 and
    // so rounds all the way up to 750 — served ~13 KB heavier than the
    // image-delivery-insight audit's "reasonable" (2x-capped) size.
    // Adding 664 (just above that 649px target) gives the responsive
    // `<Image>` a closer-fitting candidate without changing anything
    // else about how images are requested.
    deviceSizes: [640, 664, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  // Computed once here (Node build/dev-server context), not inside a React
  // server component render — see the Caseback/Footer ruling on why no
  // `new Date()` may run during a cacheComponents prerender.
  env: {
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().slice(0, 10),
    NEXT_PUBLIC_BUILD_SHA: (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 7),
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/project", destination: "/lab", permanent: true },
      { source: "/project/:slug", destination: "/lab/:slug", permanent: true },
      { source: "/work/opus", destination: "/work/process-discovery", permanent: true },
    ];
  },
};

export default withContentCollections(nextConfig);
