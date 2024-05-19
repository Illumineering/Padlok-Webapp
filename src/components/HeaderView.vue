<script>
var classNames = [];
if (navigator.userAgent.match(/(iPad|iPhone|iPod)/i)) classNames.push('device-ios');
if (navigator.userAgent.match(/android/i)) classNames.push('device-android');

var html = document.getElementsByTagName('html')[0];

if (classNames.length) classNames.push('on-device');
if (html.classList) html.classList.add.apply(html.classList, classNames);
</script>
<template>
  <header role="banner">
    <div>
        <a :href="$t('url.marketing')" target="_blank">
            <img src="/images/logo.svg" class="logo" alt="Padlok">
        </a>
        <ul class="store-links">
            <li class="hidden-android">
                <a :href="$t('appstore.url')" rel="external" target="_blank">
                    <img :src="$t('appstore.lightImage')" :alt="$t('appstore.alternative')">
                </a>
            </li>
            <li class="hidden-ios">
                <a :href="$t('url.marketing') + '#android'" rel="external" target="_blank">
                    <img :src="$t('playstore.lightImage')" :alt="$t('playstore.alternative')">
                </a>
            </li>
        </ul>
    </div>
  </header>
</template>
