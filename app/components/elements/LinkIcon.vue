<template>
  <a
    class="iconLink"
    target="_blank"
    :href="href"
    :style="`background-color: ${color}`"
  ><span :style="`background-image:url(/assets/icons/${name}.svg)`">&nbsp;</span></a>
</template>

<script>
export default {
  props: {
    name: String,
    href: String,
    color: String,
  },
}
</script>

<style lang="scss">
.iconLink {
  display: inline-block;
  border-radius: 3px;
  overflow: hidden;
  font-size: 0;

  span {
    display: inline-block;
    padding: 4px;
    width: 24px;
    height: 24px;
    font-size: 0;
    margin: 0;
    background-size: 50%;
    background-position: center;
    background-repeat: no-repeat;
    background-color: $grey-light;
    transform: none;

    &:hover, &:focus {
      background-color: unset;
    }

    @include hover;
  }
}
</style>
