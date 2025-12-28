// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  devtools: { enabled: false },
  googleFonts: {
    families: {
      'Noto Sans JP': {
        wght: [400, 500, 700]
      }
    },
    display: 'swap'
  }
})
