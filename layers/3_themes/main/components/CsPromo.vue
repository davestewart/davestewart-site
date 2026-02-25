<template>
  <transition name="fade">
    <div v-show="visible" class="promo-container" :class="{ expanded }">
      <div v-show="!expanded" class="card promo teaser">
        <div class="card-image">
          <img src="https://controlspace.app/images/social/splash-twitter.png" class="img-responsive">
        </div>
        <div class="card-header">
          <div class="card-title h4">Drowning in tabs?</div>
        </div>
        <div class="card-body">
          <p>I'm working on a new tab manager you may like...</p>
        </div>
        <div class="card-footer text-right">
          <button class="btn btn-primary plausible-event-name=CS+Open+Popup" @click="show">Show me!</button>
          <button class="btn plausible-event-name=CS+Close" @click="close">Close</button>
        </div>
      </div>

      <div v-show="expanded" class="card promo">
        <a href="https://controlspace.app" target="_blank" class="card-image">
          <img src="https://controlspace.app/images/social/splash-twitter.png" class="img-responsive">
        </a>
        <div class="card-header">
          <div class="card-title h2">Control Space</div>
        </div>
        <div class="card-body">
          <p><strong>Browse, organise, search and switch tabs with one handy shortcut</strong></p>
          <p>It's smooth, fast and powerful with beautiful information surfacing, brilliant organisational tools and
            lightning-fast keyboard navigation; if you're a tab hoarder like me you'll wonder how you lived without
            it!</p>
        </div>
        <div class="card-footer text-right">
          <a class="btn btn-primary plausible-event-name=CS+Visit+Website" href="https://controlspace.app"
             target="_blank" @click="close">Go to Control Space</a>
          <button class="btn plausible-event-name=CS+Close+Popup" @click="close">Close</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
const key = 'cs-promo'
const TIMEOUT = 7 * 24 * 60 * 60 * 1000 // one week
const DELAY = 10 * 1000
export default {
  data () {
    return {
      visible: false,
      expanded: false,
    }
  },

  mounted () {
    const timeNow = Date.now()
    const timeClosed = Number(localStorage.getItem(key) || 0)
    setTimeout(() => {
      this.visible = (timeNow - timeClosed) > TIMEOUT
    }, DELAY)
  },

  methods: {
    show () {
      this.expanded = true
    },

    hide () {
      this.expanded = false
    },

    close () {
      localStorage.setItem(key, Date.now().toString())
      this.visible = false
    },
  },
}
</script>

<style lang="scss">
@use "sass:color";

.promo-container {
  &:after {
    position: fixed;
  }

  &.expanded:after {
    display: block;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(255, 255, 255, .85);
    content: ".";
  }

  .promo,
  .teaser {
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 20px;
    max-width: 780px;
    box-shadow: 0 20px 30px rgba(0, 0, 0, .2);
    z-index: 5;
  }

  .teaser {
    max-width: 400px;
  }

  .img-responsive {
    display: block;
    height: auto;
    max-width: 100%;
  }

  .btn {
    display: inline-block;
    padding: .7rem 1rem;
    border-radius: 4px;
    font-size: 1.1em;
    font-family: $bodyFont;
    background: $grey-lightest;
    margin-right: .2em;
    line-height: 1;

    &:hover {
      text-decoration: none;
      background: color.adjust($grey-lightest, $lightness: 2%);
    }
  }

  .btn-primary {
    background: $accentColor;
    color: white;

    &:hover {
      background: color.adjust($accentColor, $lightness: 5%);
    }
  }

  .card {
    background: #fff;
    border: 0.05rem solid #dadee4;
    border-radius: 0.1rem;
    display: flex;
    flex-direction: column;
  }

  .card-image {
    width: 100%;
    //aspect-ratio: 1280 / 640;
  }

  .card-header {
    padding: 1rem 1rem 0;
    font-size: 1.6em;
    font-weight: bold;
    font-family: Europa, sans-serif;
  }

  .card-body {
    padding: 1rem 1rem 0;
    line-height: 1.6em;

    p {
      margin-bottom: .5rem;

      &:last-of-type {
        margin-bottom: .75rem;
      }
    }
  }

  .card-footer {
    display: flex;
    gap: 5px;
    padding: .5rem 1rem 1rem;
  }
}

@media screen and (max-width: 400px) {
  .promo-container {
    font-size: 14px;
  }
}
</style>
