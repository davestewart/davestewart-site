import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

function resolve (path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}

export default defineNuxtConfig({
  dir: {
    // pages: resolve('./pages'),
  },
})
