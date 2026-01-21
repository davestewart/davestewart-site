import { fileURLToPath } from 'node:url'
import ViteYaml from '@modyfi/vite-plugin-yaml'

function resolve (path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}

const source = {
  local: {
    driver: 'fs',
    base: resolve('../davestewart-content/content/'),
    name: 'content',
  },
  github: {
    driver: 'github',
    repo: 'davestewart/davestewart-content',
    dir: 'content',
  },
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-content-assets',
    '@nuxt/content',
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
        { rel: 'shortcut icon', href: '/favicon.svg' },
      ],
      script: [
        { src: 'https://gumroad.com/js/gumroad.js', async: true },
      ],
    },
  },

  css: [
    '~/assets/styles/index.scss',
  ],

  content: {
    sources: {
      content: process.env.NODE_ENV === 'production'
        ? source.github
        : source.local,
    },
    navigation: {
      fields: [
        'title', 'description',
      ],
    },
    markdown: {
      anchorLinks: false,
      remarkPlugins: [
        'remark-reading-time',
      ],
    },
    highlight: {
      theme: 'min-light',
      langs: [
        'bash',
        'ts', 'js',
        'json', 'yaml',
        'html', 'css', 'scss',
        'vue', 'vue-html',
        'xml', 'python', 'dotenv',
      ],
    },
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
    ],
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

  contentAssets: {
    // add image size hints
    imageSize: 'style src',

    // show debug messages
    debug: false,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
