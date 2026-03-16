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

  margin: 1rem 0 2rem 0;
  @include lg {
    margin: 1rem 0 2rem 1rem;
  }

  table {
    margin:0;
    margin-left: -.5rem;

    @include md-down {
      min-width: 0 !important;
      //min-width: 1000px; // factor in larger font size
    }

    @include md {
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
