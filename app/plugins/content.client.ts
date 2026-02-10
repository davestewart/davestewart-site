import { defineNuxtPlugin } from 'nuxt/app'
import { useContentStore } from '#imports'

export default defineNuxtPlugin({
  name: 'content',
  parallel: true,
  async setup () {
    useContentStore().initClient()
  },
})
