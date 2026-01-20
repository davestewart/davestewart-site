<template>
  <div v-if="show" class="previewInfo">
    <blockquote>
      <h2>This is a preview post!</h2>
      <p>That means I'm still working on it, and I'd love your feedback:</p>
      <ul>
        <li>does it read well?</li>
        <li>does the content make sense?</li>
        <li>could I have made any points better, or quicker?</li>
        <li>what would you change?</li>
      </ul>
      <p>Let me know in the comments.</p>
      <p>Thanks!</p>
      <p>
        <SiteIcon class="accent" />
      </p>
    </blockquote>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PostStatus } from '~/stores/config/status'
import { isProd } from '../../utils/config'
import SiteIcon from '../site/SiteIcon.vue'

const props = defineProps<{
  page: ParsedPage
}>()

const show = ref(false)

onMounted(() => {
  if (isProd && props.page?.status === PostStatus.PREVIEW) {
    show.value = true
  }
})
</script>

<style lang="scss">
.previewInfo {

  h2 {
    margin: 0 0 1rem;
    font-size: 1.5rem;
    color: $accentColor;
  }

  p {
    margin: 1.25rem 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  ul {
    margin: 1rem 1rem 0 2rem;
    line-height: 1.4rem;
  }

  li {
    list-style: square;
    margin-bottom: .25em;

    p {
      margin: 0;
    }
  }
}
</style>
