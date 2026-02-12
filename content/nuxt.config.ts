import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'
import type { ModuleOptions as NuxtContentOptions } from '@nuxt/content'
import type { ModuleOptions as NuxtContentAssetsOptions } from 'nuxt-content-assets'
import type { NuxtConfig } from '@nuxt/schema'

function resolve (path: string) {
  // @ts-ignore
  return fileURLToPath(new URL(path, import.meta.url))
}

function defineLayerConfig (config: NuxtConfig & {
  content?: Partial<NuxtContentOptions>
  contentAssets?: Partial<NuxtContentAssetsOptions>
}) {
  return defineNuxtConfig(config as any)
}

function source (name: string, dir = '') {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN is required in production')
    }
    return {
      driver: 'github',
      repo: `davestewart/${name}`,
      token: process.env.GITHUB_TOKEN,
      dir,
    }
  }
  return {
    driver: 'fs',
    base: resolve(`../../${name}/${dir}`),
  }
}

/**
 * Content layer
 */
export default defineLayerConfig({
  modules: [
    'nuxt-content-assets',
    '@nuxt/content',
  ],

  imports: {
    dirs: [
      'stores',
      'types',
      'utils',
    ],
  },

  content: {
    sources: {
      content: source('davestewart-content', 'content'),
      showcase: source('davestewart-showcase'),
    },

    navigation: {
      fields: [
        'title',
        'description',
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
        'ts', 'js',
        'md', 'json', 'yaml',
        'html', 'css', 'scss',
        'vue', 'vue-html',
        'bash', 'xml', 'python', 'dotenv',
      ],
    },
  },

  contentAssets: {
    imageSize: 'style src',
    // debug: true,
  },
})
