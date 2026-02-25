import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

function resolve (path: string) {
  // @ts-ignore
  return fileURLToPath(new URL(path, import.meta.url))
}

export default defineNuxtConfig({
  alias: {
    '@base': resolve('./'),
  },
  components: [
    { path: './components', pathPrefix: false },
  ],
})
