<template>
  <footer>
  <div class="centered-container flex flex-col space-y-6">
    <div class="flex px-2 justify-between items-center">
      <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-x-4">
        <a :href="$t('url.marketing')" target="_blank">
          <img class="icon" src="/images/appicon.svg" alt="Padlok AppIcon">
        </a>
        
        <ul class="store-links">
          <li><a :href="$t('appstore.url')" rel="external" target="_blank">{{ $t('appstore.alternative') }}</a></li>
          <li><a :href="$t('url.marketing') + '#android'" rel="external" target="_blank">{{ $t('playstore.alternative') }}</a></li>
        </ul>
      </div>

      <ul class="relative-links">
          <li><a :href="$t('url.terms')" target="_blank">{{ $t('footer.terms') }}</a></li>
          <li><a :href="$t('url.privacy')" target="_blank">{{ $t('footer.privacy') }}</a></li>
          <li><a :href="$t('url.support')" target="_blank">{{ $t('footer.support') }}</a></li>
      </ul>
    </div>

    <span class="copyright">
      <a href="$t('url.marketing')">Padlok©</a> 
      <a href="https://illumineering.fr">{{ $t('footer.copyright.by', { trademark: 'Illumineering®'}) }}</a> 
      {{ (new Date()).getFullYear() }} - {{ $t('footer.copyright.reserved') }}
    </span>
  </div>
</footer>
</template>
