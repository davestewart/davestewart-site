<template>
  <div class="footerIcons">
    <LinkIcon v-for="item in items" v-bind="item" />
  </div>
</template>

<script>
// https://simpleicons.org/?q=product
function link (name, color, href) {
  return { name, color, href }
}

export default {
  computed: {
    items () {
      return [
        link('twitter', '#1DA1F2', 'https://twitter.com/dave_stewart'),
        link('github', '#181717', 'https://github.com/davestewart'),
        link('linkedin', '#0A66C2', 'http://linkedin.com/in/davestewartuk/'),
      ]
    },
  },
}
</script>

<style lang="scss">
.footerIcons {
  display: flex;
  .iconLink {
    margin-left: 8px;
  }
}
</style>
