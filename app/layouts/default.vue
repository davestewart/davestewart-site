<template>
  <div class="layout__default">
    <!-- header -->
    <SiteHeader />

    <!-- main -->
    <main class="siteMain">
      <!-- content -->
      <div class="layout__outer">
        <div class="layout__navSide">
          <div>
            <div></div>
<!--            <NavSide />-->
          </div>
        </div>
        <div class="layout__inner">
          <NuxtPage />
          <transition name="page" mode="out-in"></transition>
        </div>
        <div class="layout__navPage">
          <div>
            <NavPage />
          </div>
        </div>
      </div>

      <!-- prev / next -->
      <NavSurround />

      <!-- scroll to top -->
      <ClientOnly>
        <NavScrollTop />
      </ClientOnly>
    </main>

    <!-- control space promo -->
    <ClientOnly>
      <CsPromo />
    </ClientOnly>

    <!-- lower area -->
    <div class="layout__bottom">
      <!-- footer -->
      <SiteFooter />
    </div>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
