<template>
  <div class="scroll-h">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.scroll-h {
  display: flex;
  width: 100%;
  margin: 2rem 0;
  overflow-x: scroll;

  > .table-wrapper > table,
  > * {
    margin: 0 !important;
    white-space: nowrap;
  }
}
</style>
