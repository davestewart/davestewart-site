import { computed } from 'vue'
import { getItems } from './content'
import { useRoute, useRouter } from 'vue-router'

type Link = {
  path: string
  title: string
  description?: string | ComputedRef<string>
}

export const useNavStore = defineStore('nav', () => {
  const paths = computed(() => {
    return sections.flatMap(section =>
      section.links.map(link => link.path),
    )
  })

  const allPages = computed(() => {
    const items = getItems()
    return items.filter(item => paths.value.includes(item.path))
  })

  // helpers
  function getDescription (path: string) {
    return allPages.value?.find(page => page.path === path)?.description ?? ''
  }

  const createLink = (path: string, title: string, description = ''): Link => {
    return {
      path,
      title,
      description: computed(() => {
        return description || getDescription(path)
      }),
    }
  }

  const createSection = (name: string, links: Link[]) => {
    return { name, links }
  }

  // entries
  const home = createLink('/', 'Home', 'Home page')
  const sitemap = createLink('/sitemap/', 'Site map', 'Full list of everything on the site')
  const search = createLink('/search/', 'Search', 'Search portfolio')
  const work = createLink('/work/', 'Work')
  const products = createLink('/products/', 'Products')
  const projects = createLink('/projects/', 'Projects')
  const archive = createLink('/archive/', 'Archive')
  const info = createLink('/projects/personal/dave-stewart/', 'Site', 'Info and site source code')
  const blog = createLink('/blog/', 'Blog')
  const bio = createLink('/bio/', 'Bio')

  // main sections
  const sections = [
    createSection('Navigation', [
      home,
      sitemap,
      search,
    ]),
    createSection('Creation', [
      work,
      products,
      projects,
      archive,
      info,
    ]),
    createSection('Ideation', [
      blog,
      bio,
    ]),
  ]

  const route = useRoute()

  const top = computed(() => {
    const ideation = route.path.startsWith('/archive/')
      ? [blog, archive]
      : [blog]

    return [
      createSection('Creation', [work, products, projects]),
      createSection('Ideation', ideation),
    ]
  })

  return {
    sections,
    top,
  }
})
