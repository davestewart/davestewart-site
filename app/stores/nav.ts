import { computed } from 'vue'
import { getContentParents, getItems } from './content'

type Link = {
  path: string
  title: string
  description?: string
  class?: string
}

export const useNavStore = defineStore('nav', () => {
  const content = useContentStore()

  function getItem (path: string) {
    return getItems().find(item => item.path === path)
  }

  function createLink (path: string, title: string, description = '', cssClass = ''): Link {
    return {
      path,
      title,
      description: description || getItem(path)?.description || '',
      class: cssClass,
    }
  }

  function createSection (name: string, links: Link[]) {
    return { name, links }
  }

  // entries
  const sitemap = createLink('/sitemap/', 'Site map', 'Full list of everything on the site')
  const search = createLink('/search/', 'Search', 'Search portfolio')
  const work = createLink('/work/', 'Work')
  const products = createLink('/products/', 'Products')
  const projects = createLink('/projects/', 'Projects')
  const archive = createLink('/archive/', 'Archive')
  const info = createLink('/projects/personal/dave-stewart/', 'Site', 'Info and site source code')
  const blog = createLink('/blog/', 'Blog')

  // main sections
  const sections = [
    createSection('Navigation', [
      sitemap,
      search,
    ]),
    createSection('Creation', [
      work,
      products,
      projects,
      archive,
    ]),
    createSection('Ideation', [
      blog,
      info,
    ]),
  ]

  const top = computed(() => {
    const left: Link[] = [
      work, products, projects, blog,
      { ...archive, class: content.path.startsWith('/archive/') ? '' : 'hidden' },
    ]

    const parents = getContentParents(content.path, 'Up')
    const up: Link = {
      title: 'Up',
      path: getParentPath(content.path),
      description: `Go up to ${parents.at(-2)?.title}`,
      class: `up ${parents.length > 2 ? '' : 'hidden'}`,
    }
    const right: Link[] = [up, search]

    return [
      createSection('Content', left),
      createSection('Navigation', right),
    ]
  })

  return {
    sections,
    top,
  }
})
