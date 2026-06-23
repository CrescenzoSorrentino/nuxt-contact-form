// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Server-only configuration. The empty strings are placeholders: Nuxt
  // overrides each key from the matching NUXT_<KEY> environment variable
  // (see .env.example). Because these are not under "public", they are never
  // exposed to the browser.
  runtimeConfig: {
    resendApiKey: '',
    contactRecipientEmail: '',
    contactFromEmail: '',
    upstashRedisRestUrl: '',
    upstashRedisRestToken: '',
    contactSendConfirmation: false,
  },
})
