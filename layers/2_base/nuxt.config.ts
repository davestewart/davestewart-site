import { defineNuxtConfig } from 'nuxt/config'
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

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
