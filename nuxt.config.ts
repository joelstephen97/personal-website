// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/color-mode", "@nuxtjs/google-fonts", "@nuxt/eslint"],
  pages: true,
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
      Inter: [300, 400, 500, 600, 700, 800],
    },
  },
});
