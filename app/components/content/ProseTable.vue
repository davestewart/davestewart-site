<template>
  <div class="table-wrapper">
    <table>
      <slot />
    </table>
  </div>
</template>

<style lang="scss">
.table-wrapper {
  margin: 2rem 0;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @include lg {
    margin: 2rem 0 2rem 1rem;
  }

  table {
    @include md-down {
      min-width: 1000px; // factor in larger font size
      margin: 1rem 0;
    }

    @include md-up {
      min-width: 840px; // normal content width
    }

    @include lg {
      margin: 0;
      max-width: calc(100% - 1rem);
      min-width: unset;
    }
  }

}
</style>
