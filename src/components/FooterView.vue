<template>
  <footer class="bg-sky-50 py-5">
    <div class="container px-safe mx-auto flex flex-col space-y-6">
      <div class="flex px-2 justify-between items-center">
        <a :href="$t('url.marketing')" target="_blank">
          <img src="/images/appicon.svg" alt="Padlok AppIcon" class="w-16 sm:w-20">
        </a>
        <ul class="text-xs sm:text-sm flex flex-col items-end text-right space-y-1">
          <li><a :href="$t('url.terms')" target="_blank" class="opacity-80 hover:opacity-100 hover:underline">{{ $t('footer.terms') }}</a></li>
          <li><a :href="$t('url.privacy')" target="_blank" class="opacity-80 hover:opacity-100 hover:underline">{{ $t('footer.privacy') }}</a></li>
          <li><a :href="$t('url.support')" target="_blank" class="opacity-80 hover:opacity-100 hover:underline">{{ $t('footer.support') }}</a></li>
        </ul>
      </div>
      <span class="text-xs sm:text-sm text-center text-gray-500">{{ $t('footer.copyright', { year: (new Date()).getFullYear() }) }}</span>
    </div>
  </footer>
</template>
