import { defineNuxtPlugin } from 'nuxt/app'
import { useContentStore } from '~/stores/content'
import { useSearchStore } from '~/stores/search'

export default defineNuxtPlugin({
  name: 'content',
  parallel: false,
  async setup () {
    await Promise.all([
      useContentStore().initServer(),
      useSearchStore().initServer(),
    ])
  },
})
