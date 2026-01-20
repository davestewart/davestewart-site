import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  components: {
    dirs: [
      { path: '~/components', pathPrefix: false },
      { path: '~/components/content', pathPrefix: false, global: true },
      { path: '~/components/elements', pathPrefix: false, global: true },
      { path: '~/components/lists/home', pathPrefix: false, global: true },
      { path: '~/components/nav', pathPrefix: false, global: true },
      { path: '~/components/media', pathPrefix: false, global: true },
      { path: '~/components/embeds', pathPrefix: false, global: true },
      { path: '~/components/site', pathPrefix: false, global: true },
    ],
  },

  css: [
    '~/assets/styles/index.scss',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "~/assets/styles/_variables.scss" as *;
          @use "~/assets/styles/layout/_mixins.scss" as *;
          `,
        },
      },
    },
  },
})
