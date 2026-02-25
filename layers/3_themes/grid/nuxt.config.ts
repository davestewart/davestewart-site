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

  components: {
    dirs: [
      { path: resolve('../main/components'), pathPrefix: false },
    ],
  },

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
