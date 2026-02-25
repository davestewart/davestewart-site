import { fileURLToPath } from 'node:url'
import ViteYaml from '@modyfi/vite-plugin-yaml'
import SvgLoader from 'vite-svg-loader'

function resolve (path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // -------------------------------------------------------------------------------------------------------------------
  // third-party
  // -------------------------------------------------------------------------------------------------------------------

  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
  ],

  // -------------------------------------------------------------------------------------------------------------------
  // layers and folders
  // -------------------------------------------------------------------------------------------------------------------

  dir: {
    public: resolve('./public'),
  },

  alias: {
    '@content': resolve('layers/1_content'),
  },

  // include layers for app include scope
  typescript: {
    tsConfig: {
      include: [
        '../layers/1_content/*.d.ts',
        '../layers/1_content/**/*',
        '../layers/2_base/*.d.ts',
        '../layers/2_base/**/*',
        '../layers/3_themes/*/*.d.ts',
        '../layers/3_themes/*/**/*',
      ],
    },
  },

  // -------------------------------------------------------------------------------------------------------------------
  // application
  // -------------------------------------------------------------------------------------------------------------------

  app: {
    head: {
      title: 'Dave Stewart',
      titleTemplate: '%s | Dave Stewart',
      meta: [
        { name: 'theme-color', content: '#ea4848' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      script: [
        { src: 'https://gumroad.com/js/gumroad.js', async: true },
      ],
    },
  },

  // -------------------------------------------------------------------------------------------------------------------
  // routing and rendering
  // -------------------------------------------------------------------------------------------------------------------

  experimental: {
    appManifest: false,
    defaults: {
      nuxtLink: {
        trailingSlash: 'append',
      },
    },
  },

  routeRules: {
    '/': { prerender: false, ssr: true },
    '/404': { prerender: false, ssr: true },
    '/**': { prerender: true },
  },

  // -------------------------------------------------------------------------------------------------------------------
  // build
  // -------------------------------------------------------------------------------------------------------------------

  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN,
  },

  vite: {
    plugins: [
      ViteYaml(),
      SvgLoader(),
    ],
    resolve: {
      alias: {
        '@content': resolve('layers/1_content'),
      },
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
