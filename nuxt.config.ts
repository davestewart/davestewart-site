import { fileURLToPath } from 'node:url'
import ViteYaml from '@modyfi/vite-plugin-yaml'
import SvgLoader from 'vite-svg-loader'

function resolve (path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    'content',
    resolve('themes/core'),
  ],

  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
  ],

  components: {
    dirs: [
      { path: '~/components', pathPrefix: false },
    ],
  },

  devtools: { enabled: true },

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

  css: [
    '~/assets/styles/index.scss',
  ],

  dir: {
    public: resolve('./public'),
  },

  alias: {
    '@content': resolve('content'),
  },

  experimental: {
    appManifest: false,
    defaults: {
      nuxtLink: {
        trailingSlash: 'append',
      },
    },
  },

  compatibilityDate: '2025-07-15',

  vite: {
    plugins: [
      ViteYaml(),
      SvgLoader(),
    ],
    resolve: {
      alias: {
        '@content': resolve('content'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "~/assets/styles/_variables.scss" as *;
          @use "~/assets/styles/layout/_mixins.scss" as *;
          `,
        },
      },
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
