<template>
  <header role="banner" class="sticky top-0 bg-padlok-blue text-white overflow-hidden">
    <div class="container px-safe mx-auto flex justify-between items-center">
      <div class="flex items-baseline px-2">
        <a :href="$t('url.marketing')" target="_blank">
          <h1 class="py-2 text-4xl sm:text-5xl font-hkgrotesk-black">PADL<span class="text-padlok-cyan relative"><svg class="absolute top-6 w-9 sm:top-7 sm:left-0 sm:w-12 fill-skintone-0" viewbox="0 0 48 61"><use xlink:href="https://padlok.app/images/hand.svg#Hand"/></svg>OK</span></h1>
        </a>
      </div>
      <a :href="$t('url.appstore')" target="_blank" class="px-2 py-4 sm:px-4 hidden sm:inline-block">
        <img :src="'https://padlok.app/images/' + $i18n.locale + '/appstore-light.svg'" :alt="$t('alternative.appstore')">
      </a>
    </div>
  </header>
</template>
