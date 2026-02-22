// https://nuxt.com/docs/api/configuration/nuxt-config
// Note: ssr: false causes crawlers to miss H1/headings. Enabling SSR triggers
// prerender "Unexpected token" error—investigate Node/Nitro compatibility.
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-02-22",
  devtools: { enabled: false },
  modules: [
    "@nuxtjs/color-mode",
    "@nuxtjs/google-fonts",
    "@nuxtjs/critters",
    "@nuxt/image",
    "@nuxt/eslint",
    "@vite-pwa/nuxt",
    "@nuxtjs/sitemap",
  ],

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL ?? "https://joelstephen.vercel.app",
  },

  sitemap: {
    strictNuxtContentPaths: true,
    zeroRuntime: true,
    urls: async () => {
      const siteUrl =
        process.env.NUXT_PUBLIC_SITE_URL ?? "https://joelstephen.vercel.app";
      const routes = [
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
      return routes.map((path) => ({
        loc: path === "/" ? siteUrl : `${siteUrl}${path}`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly" as const,
        priority: path === "/" ? 1 : path === "/project" ? 0.9 : 0.8,
      }));
    },
  },

  pwa: {
    disable: process.env.NODE_ENV === "development",
    registerType: "autoUpdate",
    manifest: {
      name: "Joel Stephen | Software Engineer",
      short_name: "Joel Stephen",
      description:
        "Full-stack engineer with 5+ years of experience. Building beautiful, performant web experiences.",
      theme_color: "#007AFF",
      background_color: "#fafafc",
      icons: [
        { src: "/pwa-64x64.png", sizes: "64x64", type: "image/png" },
        { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/maskable-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico,woff2}"],
      globIgnores: ["**/og-image.png"],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: false,
    },
  },
  pages: true,

  experimental: {
    viewTransition: true,
    appManifest: false,
    renderJsonPayloads: false,
    payloadExtraction: false,
    defaults: {
      nuxtLink: {
        prefetch: false,
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      title: "Joel Stephen | Software Engineer",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#007AFF" },
        {
          name: "description",
          content:
            "Full-stack engineer with 5+ years of experience. Building beautiful, performant web experiences with modern technologies.",
        },
        {
          name: "google-site-verification",
          content:
            process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
            "bYqlobb96_jw9-bMer4ClmINiQdolk0iW7dvLYVYKC4",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico?v=2" },
        { rel: "dns-prefetch", href: "https://va.vercel-insights.com" },
      ],
    },
  },

  runtimeConfig: {
    groqApiKey: process.env.GROQ_API_KEY ?? "",
    public: {
      siteUrl:
        process.env.NUXT_PUBLIC_SITE_URL ?? "https://joelstephen.vercel.app",
      twitterCreator:
        process.env.NUXT_PUBLIC_TWITTER_CREATOR ?? "@joelstephen97",
      twitterSite: process.env.NUXT_PUBLIC_TWITTER_SITE ?? "@joelstephen97",
    },
  },

  routeRules: {
    "/**": {
      headers: {
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy":
          "camera=(), microphone=(self), geolocation=(), interest-cohort=()",
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "credentialless",
        "Content-Security-Policy":
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' blob: https://va.vercel-insights.com https://va.vercel-scripts.com https://cdn.jsdelivr.net; " +
          "style-src 'self' 'unsafe-inline'; " +
          "font-src 'self' data:; " +
          "img-src 'self' data: blob: https:; " +
          "media-src 'self' blob:; " +
          "connect-src 'self' blob: https://va.vercel-insights.com https://api.groq.com https://*.huggingface.co https://huggingface.co https://cdn.jsdelivr.net; " +
          "frame-ancestors 'none'; " +
          "base-uri 'self'; " +
          "form-action 'self'; " +
          "object-src 'none'; " +
          "require-trusted-types-for 'script'; " +
          "trusted-types default vue dompurify;",
      },
    },
  },

  nitro: {
    prerender: {
      routes: [
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
      ],
    },
  },
  $production: {
    nitro: {
      preset: "vercel",
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: "",
    storageKey: "color-mode",
  },
  googleFonts: {
    families: {
      Geist: [400, 500, 600],
      "Geist Mono": [400, 500, 600],
    },
    display: "swap",
    preconnect: false,
    prefetch: false,
  },
  image: {
    domains: ["avatars.githubusercontent.com", "r6operators.marcopixel.eu"],
    screens: {
      avatar: 32,
      avatar2x: 64,
      operator: 48,
      operator2x: 96,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    },
    presets: {
      avatar: {
        modifiers: { width: 32, height: 32, format: "webp", quality: 80 },
      },
    },
  },

  critters: {
    config: { preload: "swap" },
  },
  hooks: {
    "nitro:init"(nitro) {
      nitro.hooks.hook("prerender:generate", async (route) => {
        if (typeof route.contents !== "string") return;

        const { join } = await import("node:path");
        const { readdir } = await import("node:fs/promises");

        const rootDir = nitro.options.rootDir;
        const clientDir = join(rootDir, ".nuxt", "dist", "client", "_nuxt");

        let fontFiles: string[];
        try {
          const files = await readdir(clientDir);
          fontFiles = files.filter(
            (f) =>
              f.endsWith(".woff2") &&
              (f.startsWith("Geist-400-3") ||
                f.startsWith("Geist_Mono-400-12")),
          );
        } catch {
          return;
        }

        if (fontFiles.length === 0) return;

        const preloadLinks = fontFiles
          .map(
            (f) =>
              `<link rel="preload" href="/_nuxt/${f}" as="font" type="font/woff2" crossorigin>`,
          )
          .join("\n    ");

        const headClose = route.contents.indexOf("</head>");
        if (headClose === -1) return;

        route.contents =
          route.contents.slice(0, headClose) +
          "\n    " +
          preloadLinks +
          "\n  " +
          route.contents.slice(headClose);
      });
    },
  },
  vite: {
    build: {
      sourcemap: true,
    },
    optimizeDeps: {
      exclude: [
        "@tensorflow/tfjs-core",
        "@tensorflow/tfjs-backend-webgl",
        "@tensorflow-models/body-pix",
        "@huggingface/transformers",
      ],
    },
  },
});
