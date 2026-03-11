import { defineNuxtConfig } from 'nuxt/config'
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  dir: {
    app: '.',
  },

  components: [
    { path: './components', pathPrefix: false },
    { path: './components/home', pathPrefix: false, global: true },
    { path: './layers/showcase/components', pathPrefix: false, global: true },
  ],

  css: [
    resolve('./assets/styles/index.scss'),
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "${resolve('./assets/styles/_variables.scss')}" as *;
          @use "${resolve('./assets/styles/layout/_mixins.scss')}" as *;
          `,
        },
      },
    },
  },
})
