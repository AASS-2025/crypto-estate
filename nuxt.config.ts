// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxtjs/supabase"],

  css: ["~/assets/css/main.css"],

  future: {
    compatibilityVersion: 4,
  },
  supabase: {
    types: "./shared/types/supabase.types.ts",
    redirect: false,
    redirectOptions: {
      exclude: ["*"],
      callback: "",
      login: "",
    },
  },

  compatibilityDate: "2024-11-27",
  runtimeConfig: {
    public: {
      redirectUrl: "",
    },
  },
});
