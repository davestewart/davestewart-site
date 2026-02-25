import { fileURLToPath } from 'node:url'

function resolve (path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    resolve('./main'),
  ],

  alias: {
    '@main': resolve('./main'),
    '@grid': resolve('./grid'),
  },

  typescript: {
    tsConfig: {
      include: [
        '../layers/3_themes/*/*.d.ts',
        '../layers/3_themes/*/**/*',
      ],
    },
  },
})
