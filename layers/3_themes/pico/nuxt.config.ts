import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

function resolve (path: string) {
  // @ts-ignore
  return fileURLToPath(new URL(path, import.meta.url))
}

const PATH = resolve('.')

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
