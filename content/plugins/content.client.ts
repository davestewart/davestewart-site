import { defineNuxtPlugin } from 'nuxt/app'
import { usePageStore } from '../stores/page'

export default defineNuxtPlugin({
  name: 'content',
  parallel: true,
  async setup () {
    usePageStore().initClient()
  },
})
