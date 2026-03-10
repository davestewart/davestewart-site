<script lang="ts" setup>
const props = defineProps<{ error: any }>()

const showcase = useState('showcase', () => '')
const metaStore = useMetaStore()
await callOnce('items', () => metaStore.loadItems(showcase.value))

useSeoMeta({
  title: () => props.error.statusMessage || 'Error',
})
</script>

<template>
  <div id="app">
    <div class="layout__default">
      <SiteHeader />
      <main class="siteMain">
        <div class="layout__inner">
          <div>
            <div class="layout__error">
              <h1>{{ error.statusMessage }}</h1>
              <div class="pageContent">
                <p>Sorry about that.</p>
                <details>
                  <summary>
                    <span>Stack Trace:</span>
                  </summary>
                  <pre style="margin: 1em">{{ String(error.stack)
                    .replace(/^.+\n/, '')
                    .trim()
                    .replace(/\(/g, '\n  file: ')
                    .replace(/:(\d+:\d+)\)/g, '\n  line: $1')
                  }}</pre>
                </details>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div class="layout__bottom">
        <SiteFooter />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.layout__error {
  h3 {
    color: $accentColor;
    margin-top: 0;
  }

  details {
    summary {
      padding: 0.5em;
      cursor: pointer;
      span {
        padding-left: 0.3em;
      }
    }
  }

  pre {
    margin-left: 2em !important;
  }
}
</style>
