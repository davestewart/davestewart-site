<template>
  <footer class="siteFooter">
    <div class="layout__inner siteFooter__branding">
      <SiteBranding to="/" />
      <SocialLinks />
    </div>

    <div class="layout__inner siteFooter__sections">
      <NavSections />
    </div>

    <div class="layout__inner siteFooter__link">
      <span>Are you looking for a new <a href="https://controlspace.app" target="_blank">tab manager</a> ?</span>
    </div>
  </footer>
</template>

<style lang="scss">
.siteFooter {
  .layout__inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px dashed $grey-lightest;

    &.siteFooter__sections {
      padding: 1rem 0.5rem;
    }
  }

  &__branding {
    padding-bottom: 1.5rem;
    padding-top: 1.5rem;

    @include sm {
      zoom: 0.9;
    }
  }

  &__sections {
    padding-top: 1rem;
  }

  &__link {
    padding-bottom: 5rem !important;
    justify-content: end !important;

    span {
      font-size: .85em;
    }
  }
}
</style>
