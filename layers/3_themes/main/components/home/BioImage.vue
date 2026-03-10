<template>
  <div class="bioImage">
    <img
      src="/assets/img/dave-wide.jpg"
      alt="Dave Stewart's profile picture"
      width="1600"
      height="800"
    >
  </div>
</template>

<style lang="scss">
.bioImage {

  margin: 0;
  font-size: 0;

  @media print {
    display: none;
  }

  // make 2:1 image 1:1 on small screens
  @include md-down {
    overflow: hidden;

    img{
      display: block;
      aspect-ratio:1/1 !important;
      object-fit: cover;
      object-position: center;
      background: #333;
    }
  }
}
</style>
