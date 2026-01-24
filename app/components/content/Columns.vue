<template>
  <div class="columns">
    <slot />
  </div>
</template>

<style scoped>
.columns {
  display: flex;
}

@media (max-width: 600px) {
  .columns {
    flex-direction: column;
  }
}
</style>
