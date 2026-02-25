import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

function resolve(path: string) {
  // @ts-ignore
  return fileURLToPath(new URL(path, import.meta.url))
}

// const PATH = resolve('.')

export default defineNuxtConfig({
  dir: {
    app: '.',
  },

  components: [
    { path: './components', pathPrefix: false },
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
