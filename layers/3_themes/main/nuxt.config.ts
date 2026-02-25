import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

function resolve (path: string) {
  // @ts-ignore
  return fileURLToPath(new URL(path, import.meta.url))
}

export default defineNuxtConfig({
  dir: {
    app: resolve('./'),
  },

  css: [
    resolve('./assets/styles/index.scss'),
  ],

  alias: {
    // '@content': resolve('../../layers/content'),
  },

  components: [
    { path: './components', pathPrefix: false },
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
