// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-02-22",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/color-mode",
    "@nuxtjs/google-fonts",
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
      description: "Full-stack engineer with 5+ years of experience. Building beautiful, performant web experiences.",
      theme_color: "#007AFF",
      background_color: "#fafafc",
      icons: [
        { src: "/pwa-64x64.png", sizes: "64x64", type: "image/png" },
        { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
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
        ...(process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION
          ? [
              {
                name: "google-site-verification",
                content: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
              },
            ]
          : []),
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico?v=2" },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        { rel: "dns-prefetch", href: "https://va.vercel-insights.com" },
      ],
    },
  },

  runtimeConfig: {
    groqApiKey: process.env.GROQ_API_KEY ?? "",
    public: {
      siteUrl:
        process.env.NUXT_PUBLIC_SITE_URL ?? "https://joelstephen.vercel.app",
      twitterCreator: process.env.NUXT_PUBLIC_TWITTER_CREATOR ?? "@joelstephen97",
      twitterSite: process.env.NUXT_PUBLIC_TWITTER_SITE ?? "@joelstephen97",
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
  },
  image: {
    domains: ["avatars.githubusercontent.com", "r6operators.marcopixel.eu"],
  },

  vite: {
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
