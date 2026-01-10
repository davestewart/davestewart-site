// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-content-assets',
    '@nuxt/content',
    '@nuxt/eslint',
  ],

  components: {
    dirs: [
      { path: '~/components', pathPrefix: false },
      { path: '~/components/content', pathPrefix: false, global: true },
      { path: '~/components/elements', pathPrefix: false, global: true },
      { path: '~/components/lists/home', pathPrefix: false, global: true },
      { path: '~/components/nav', pathPrefix: false, global: true },
      { path: '~/components/media', pathPrefix: false, global: true },
      { path: '~/components/embeds', pathPrefix: false, global: true },
      { path: '~/components/site', pathPrefix: false, global: true },
    ],
  },

  devtools: { enabled: true },

  compatibilityDate: '2025-07-15',

  app: {
    head: {
      title: 'Dave Stewart',
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

  experimental: {
    defaults: {
      nuxtLink: {
        trailingSlash: 'append',
      },
    },
  },

  content: {
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
  },

  experimental: {
    appManifest: false,
  },

  vite: {
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

  // https://github.com/davestewart/nuxt-content-assets/#configuration
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
