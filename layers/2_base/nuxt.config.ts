import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

function resolve (path: string) {
  // @ts-ignore
  return fileURLToPath(new URL(path, import.meta.url))
}

const PATH = resolve('.')

export default defineNuxtConfig({
  dir: {
    app: PATH,
  },

  alias: {
    '@base': PATH,
  },

  components: [
    { path: './components', pathPrefix: false },
  ],
})
