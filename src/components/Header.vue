<template>
  <header role="banner" class="sticky top-0 bg-padlok-blue text-white overflow-hidden">
    <div class="container px-safe mx-auto flex justify-between items-center">
      <a :href="$t('url.marketing')" class="px-2" target="_blank">
        <h1 class="py-2 text-4xl sm:text-5xl font-hkgrotesk-black">PADL<span class="text-padlok-cyan relative"><svg class="absolute top-6 w-9 sm:top-7 sm:left-0 sm:w-12 fill-skintone-0" viewBox="0 0 48 61"><use xlink:href="/images/hand.svg#Hand"/></svg>OK</span></h1>
      </a>
      <a :href="$t('appstore.url')" target="_blank" class="px-2 py-2 sm:px-4 sm:py-4">
        <img :src="$t('appstore.lightImage')" :alt="$t('appstore.alternative')">
      </a>
    </div>
  </header>
</template>
