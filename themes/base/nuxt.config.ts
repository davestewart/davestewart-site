import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

function resolve (path: string) {
  // @ts-ignore
  return fileURLToPath(new URL(path, import.meta.url))
}

export default defineNuxtConfig({
  alias: {
    // '@content': resolve('../../layers/content'),
  },

  components: [
    { path: './components', pathPrefix: false },
  ],
})
