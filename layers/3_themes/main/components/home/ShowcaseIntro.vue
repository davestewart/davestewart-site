<template>
  <div class="showcase__intro">
    <div class="showcase__content">
      <div class="animate-block">
        <SiteIcon height="40px" />
      </div>
      <div>
        <h2 class="animate-block">
          {{ page.introTitle || 'Project Showcase' }}
        </h2>
        <p class="animate-block">
          I've prepared this project shortlist for you, and I hope it's useful in future conversations between us.
        </p>
        <p class="animate-block">
          On the next screen, you will be able to:
        </p>
        <ul>
          <li class="animate-block">
            <UiIcon size="28" icon="mouse" />
            <span>Navigate and search, using the links and menus</span>
          </li>
          <li class="animate-block only-md-up">
            <UiIcon size="28" icon="keyboard" />
            <span>Use <kbd>shift</kbd> + <kbd>cursor</kbd> keys to step through projects</span>
          </li>
          <li class="animate-block">
            <UiIcon size="28" icon="printer" />
            <span>Print to paper or PDF if you need an offline copy</span>
          </li>
        </ul>
        <p class="animate-block">
          When you're done, click <strong>Exit</strong> to browse my full portfolio and blog.
        </p>
      </div>
      <div class="animate-block" style="margin-top: -1rem">
        <a href="#continue" @click.prevent="emit('close')">Continue...</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])

defineProps<{
  page: PageContent
}>()
</script>

<style lang="scss">
.showcase {
  &__intro {
    @include lg {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-top: 2.5rem;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    h2 {
      margin-top: 0 !important;
      line-height: 1.3;
    }

    p:first-of-type {
      @include introText;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    gap: 2rem;
    padding: 0 .75rem;
    max-width: 64ch;

    ul {
      margin: 1.5rem 1.25rem;
    }

    li {
      display: inline-flex;
      align-items: center;
      gap: .75rem;
      margin-bottom: .75rem;

      @include sm {
        display: list-item;

        .uiIcon {
          display: none;
        }
      }
    }
  }

  kbd {
    border-color: black !important;
  }

  .siteIcon {
    fill: $accentColor;
  }

  a[href="#continue"] {
    font-family: $titleFont;
    font-size: 1.3rem;
    font-weight: 500;
  }

  strong {
    color: $accentColor;
    font-weight: normal;
  }
}
</style>
