// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-02-22",
  devtools: { enabled: true },
  modules: ["@nuxtjs/color-mode", "@nuxtjs/google-fonts", "@nuxt/eslint", "@vite-pwa/nuxt"],

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
      title: "Joel Stephen | Software Engineer",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Full-stack engineer with 5+ years of experience. Building beautiful, performant web experiences with modern technologies.",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico?v=2" }],
    },
  },

  runtimeConfig: {
    groqApiKey: process.env.GROQ_API_KEY ?? "",
    public: {},
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
    preference: "system",
    fallback: "light",
    classSuffix: "",
    storageKey: "color-mode",
  },
  googleFonts: {
    families: {
      Geist: [400, 500, 600, 700],
      "Geist Mono": [400, 500, 600],
      Inter: [400, 500, 600, 700],
    },
    display: "swap",
  },
});
