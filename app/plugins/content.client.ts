import { defineNuxtPlugin } from 'nuxt/app'
import { useSearchStore, useContentStore } from '#imports'

export default defineNuxtPlugin({
  name: 'content',
  parallel: true,
  async setup () {
    useContentStore().initClient()
    useSearchStore().initClient()
  },
})
