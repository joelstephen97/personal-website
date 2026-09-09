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
  images: { formats: ["image/avif", "image/webp"] },
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
