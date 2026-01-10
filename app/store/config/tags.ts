interface TagGroup {
  title: string
  tags: string[]
}

export const tagGroups: TagGroup[] = []

function addGroup (title: string, tags: string[]): void {
  tagGroups.push({ title, tags })
}

addGroup('Domain', [
  'concept',
  'creative',
  'technical',
  'frontend',
  'backend',
  'enterprise',
  'jamstack',
  'rapid-build',
  'mashup',
])

addGroup('Format', [
  'webapp',
  'website',
  'plugin',
  'library',
  'framework',
  'chrome-extension',
  'game',
])

addGroup('Attributes', [
  'ui',
  'api',
  'data',
  'database',
  'animation',
  'physics',
  'social',
  'video',
  'state',
  'maps',
  '3d',
  'ugc',
])

addGroup('Language', [
  'javascript',
  'typescript',
  'html',
  'node',
  'php',
  'as3',
  'sql',
  'graphql',
  'svg',
  'jsfl',
  'vba',
])

addGroup('Software', [
  'vue',
  'nuxt',
  'laravel',
  'flash',
  '3dsmax',
  'after-effects',
])

addGroup('Device', [
  'ipad',
  'mobile',
  'responsive',
])

addGroup('Category', [
  'productivity',
  'tools',
])

addGroup('Other', [
  'award',
])
