// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
  ],

  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },
  ui: {
    colorMode: false,
  },
  runtimeConfig: {
    turso: {
      databaseUrl: "", // can be overridden by NUXT_TURSO_DATABASE_URL
      authToken: "", // can be overridden by NUXT_TURSO_AUTH_TOKEN
    },
  },
});
