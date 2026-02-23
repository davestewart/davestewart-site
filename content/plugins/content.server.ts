import { defineNuxtPlugin } from 'nuxt/app'
import { useMetaStore } from '../stores/meta'

export default defineNuxtPlugin({
  name: 'content',
  parallel: false,
  async setup () {
    await Promise.all([
      useMetaStore().initServer(),
    ])
  },
})
