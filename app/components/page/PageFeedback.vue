<template>
  <div class="pageFeedback pageContent">
    <h2>{{ title }}</h2>
    <template v-if="$route.path.includes('/blog/')">
      <p>I hope you found this article useful or enjoyable.</p>
    </template>

    <template v-else>
      <p>I hope you found this post interesting or perhaps useful.</p>
    </template>

    <p>
      If you want to engage further, follow me on
      <a href="https://twitter.com/dave_stewart" target="_blank">Twitter</a>,
      <a href="https://bsky.app/profile/davestewart.uk" target="_blank">Bluesky</a>,
      or drop a <a href="#hyvor-talk-view">comment</a> or <a href="#hyvor-talk-view">reaction</a> below.
    </p>
    <p>Either way, thanks for reading!</p>

    <SiteIcon size="32" fill="#EA4848" />

    <div id="hyvor-talk-view"></div>
  </div>
</template>

<script>
export default {
  props: {
    websiteId: String,

    title: {
      type: String,
      default: 'Feedback',
    },

    scrollThreshold: {
      type: [Number, String],
      default: 'auto',
    },
  },

  mounted () {
    window.IntersectionObserver
      ? this.$route.query['ht-comment-id']
        ? this.addScript()
        : this.addObserver()
      : this.addScript()
  },

  unmounted () {
    this.removeObserver()
    this.removeScript()
  },

  methods: {
    // see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#creating_an_intersection_observer
    addObserver () {
      const bottom = this.scrollThreshold === 'auto'
        ? window.innerHeight
        : this.scrollThreshold
      const options = {
        root: null,
        rootMargin: `0px 0px ${bottom}px 0px`,
        threshold: 0,
      }
      this._observer = new IntersectionObserver(this.onChange, options)
      this._observer.observe(this.$el)
    },

    removeObserver () {
      if (this._observer) {
        this._observer.unobserve(this.$el)
        this._observer.disconnect()
        this._observer = null
      }
    },

    onChange (changes, observer) {
      changes.forEach((change) => {
        if (change.intersectionRatio > 0) {
          this.removeObserver()
          this.addScript()
        }
      })
    },

    addScript () {
      if (!this._script) {
        // add hyvor widget
        window.HYVOR_TALK_WEBSITE = this.websiteId
        this._script = document.createElement('script')
        this._script.type = 'text/javascript'
        this._script.src = 'https://talk.hyvor.com/web-api/embed.js'
        document.body.appendChild(this._script)

        // remove hyvor footer
        setTimeout(() => {
          const sh = document.querySelector('#hyvor-talk-view').firstChild.shadowRoot
          sh.querySelector('.main-box-footer').style.cssText = 'display: none;'
        }, 500)
      }
    },

    removeScript () {
      if (this._script) {
        document.body.removeChild(this._script)
      }
    },
  },
}
</script>

<style lang="scss">
.pageFeedback {
  margin-top: 5rem;
  //border-top: 1px solid $grey-lightest;
}

#hyvor-talk-view {
  min-height: 280px;
  margin-bottom: -60px;
  margin-left: -1rem;
  margin-right: -1rem;
  width: calc(100% + 2rem) !important;
  max-width: unset !important;

  iframe {
    width: calc(100% + 2rem) !important;
  }

  .main-box-footer {
    display: none;
  }
}
</style>
