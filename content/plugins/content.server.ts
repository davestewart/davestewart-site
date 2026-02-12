import { defineNuxtPlugin } from 'nuxt/app'
import { useMetaStore } from '../stores/meta'
import { usePageStore } from '../stores/page'

export default defineNuxtPlugin({
  name: 'content',
  parallel: false,
  async setup () {
    await Promise.all([
      useMetaStore().initServer(),
      usePageStore().initServer(),
    ])
  },
})
