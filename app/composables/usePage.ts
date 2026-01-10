import { inject, provide, type InjectionKey, type Ref } from 'vue'

const ContentKey: InjectionKey<Ref<any>> = Symbol('Content')

export const provideContent = (content: Ref<any>) => {
  provide(ContentKey, content)
}

export const usePage = () => {
  const page = inject(ContentKey, undefined)
  return !page
    ? { page: ref(undefined) }
    : { page }
}
