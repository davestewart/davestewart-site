import { defineNuxtPlugin } from 'nuxt/app'
import { useContentStore } from '../stores/content'

export default defineNuxtPlugin({
  name: 'content',
  parallel: false,
  async setup () {
    await Promise.all([
      useContentStore().initServer(),
    ])
  },
})
