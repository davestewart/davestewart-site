import { defineNuxtPlugin } from 'nuxt/app'
import { useContentStore } from '../stores/content'

export default defineNuxtPlugin({
  name: 'content',
  parallel: true,
  async setup () {
    useContentStore().initClient()
  },
})
