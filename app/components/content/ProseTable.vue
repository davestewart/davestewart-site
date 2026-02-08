<template>
  <div class="table-wrapper">
    <table>
      <slot />
    </table>
  </div>
</template>

<style lang="scss">
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @include lg {
    margin: 2rem 0 2rem 1rem;

    table {
      max-width: calc(100% - 1rem);
    }
  }
}
</style>
