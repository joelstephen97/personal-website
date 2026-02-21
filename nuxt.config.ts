// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-02-22",
  devtools: { enabled: true },
  modules: ["@nuxtjs/color-mode", "@nuxtjs/google-fonts", "@nuxt/eslint"],
  pages: true,

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
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  runtimeConfig: {
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
