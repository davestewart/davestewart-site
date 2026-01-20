<template>
  <div class="thumbnailWall">
    <div class="thumbnailWall__grid">
      <div v-for="page in pages" :key="page.path" class="thumbnailWall__item">
        <ThumbnailItem :page="page" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  pages: ContentPage[]
}>()
</script>

<style lang="scss">
.thumbnailWall {
  margin-top: 1rem;
  margin-bottom: 20px;

  &__grid {
    display: grid;
    column-gap: 20px;
    row-gap: 20px;

    grid-template-columns: repeat(3, 1fr);

    // Responsive overrides
    @media (max-width: 740px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 430px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  &__item {
    break-inside: avoid;
  }
}
</style>
