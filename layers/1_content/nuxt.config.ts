import { defineNuxtConfig } from 'nuxt/config'
import type { ModuleOptions as NuxtContentOptions } from '@nuxt/content'
import type { ModuleOptions as NuxtContentAssetsOptions } from 'nuxt-content-assets'
import type { NuxtConfig } from '@nuxt/schema'
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

// env
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const IS_DEV = process.env.NODE_ENV === 'development'
const LOCAL = process.env.LOCAL === 'true'

// console.log('IS_DEV', IS_DEV)
// console.log('LOCAL', LOCAL)

/**
 * Definition helper
 *
 * For some reason, the types are not working in layers, so we've
 * created this helper to allow us to use the types and properties
 */
function defineLayerConfig (config: NuxtConfig & {
  content?: Partial<NuxtContentOptions>
  contentAssets?: Partial<NuxtContentAssetsOptions>
}) {
  return defineNuxtConfig(config as any)
}

function source (name: string, dir = '') {
  // local repo copy for development
  if (IS_DEV || LOCAL) {
    const path = dir
      ? `${name}/${dir}`
      : name
    return {
      driver: 'fs',
      base: resolve(`../../../${path}`),
    }
  }

  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is required in production')
  }
  return {
    driver: 'github',
    repo: `davestewart/${name}`,
    token: GITHUB_TOKEN,
    dir,
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
        'md', 'json', 'json5', 'yaml', 'mermaid',
        'html', 'css', 'scss',
        'vue', 'vue-html',
        'bash', 'http', 'xml', 'python', 'dotenv',
      ],
    },
  },

  contentAssets: {
    imageSize: 'src attrs',
    // debug: true,
  },
})
