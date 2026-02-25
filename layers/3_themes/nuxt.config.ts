import { fileURLToPath } from 'node:url'

function resolve(path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}

const theme = process.env.THEME ?? 'main'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    resolve(theme),
  ],

  // do we need to alias all layers to make sure that aliases always work?
  alias: {
    '@main': resolve('./main'),
    '@pico': resolve('./pico'),
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
