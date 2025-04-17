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
    gqlHost: "https://4ee05394-2008-481a-8d7b-42b94038e7fd.squids.live/crypto-estate-indexer@v4/api/graphql",
  },
});
