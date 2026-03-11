import { defineNuxtConfig } from 'nuxt/config'
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  dir: {
    app: '.',
  },

  components: [
    { path: resolve('../main/components'), pathPrefix: false },
  ],

  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.colors.min.css' },
      ],
    },
  },

  css: [
    resolve('assets/styles.scss'),
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "${resolve('../main/assets/styles/_variables.scss')}" as *;
          @use "${resolve('../main/assets/styles/layout/_mixins.scss')}" as *;
          `,
        },
      },
    },
  },
})
