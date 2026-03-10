<template>
  <div class="layout__default">
    <!-- header -->
    <SiteHeader />

    <!-- main -->
    <main class="siteMain">
      <!-- content -->
      <div class="layout__outer">
        <div class="layout__left">
          <NavSide />
        </div>
        <div class="layout__inner">
          <NuxtPage />
        </div>
        <div class="layout__right">
          <NavPage />
        </div>
      </div>

      <!-- scroll to top -->
      <ClientOnly>
        <NavScrollTop />
      </ClientOnly>
    </main>

    <!-- lower area -->
    <div class="layout__bottom">
      <!-- footer -->
      <SiteFooter />
    </div>
  </div>
</template>

<style>
.layout__left,
.layout__right {
  //display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  //height: 90%;

  @include sm {
    display: none;
  }
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.05s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
