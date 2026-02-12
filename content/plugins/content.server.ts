import { defineNuxtPlugin } from 'nuxt/app'
import { useMetaStore } from '../stores/meta'
import { useContentStore } from '../stores/content'

export default defineNuxtPlugin({
  name: 'content',
  parallel: false,
  async setup () {
    await Promise.all([
      useMetaStore().initServer(),
      useContentStore().initServer(),
    ])
  },
})
