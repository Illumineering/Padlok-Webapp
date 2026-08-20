<script setup>
import AddressView from './components/AddressView.vue'
import FooterView from './components/FooterView.vue'
import HeaderView from './components/HeaderView.vue'
import LoadingIndicator from './components/LoadingIndicator.vue'
import NotFoundMessage from './components/NotFoundMessage.vue'
import { resolve } from './share'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMeta } from 'vue-meta'

const { t } = useI18n({ useScope: 'global' })
const title = t('head.title')
const description = t('head.description')

useMeta({
  title,
  meta: [
    { itemprop: 'name', content: title },
    { property: 'og:title', content: title },
    { itemprop: 'description', content: description },
    { property: 'og:description', content: description },
    { name: 'description', content: description },
    { name: 'twitter:description', content: description }
  ]
})

// Main data
const data = ref({ loading: true, address: null, error: false, reason: null })

// Computed properties
const loading = computed(() => data.value.loading)
const notFound = computed(() => data.value.error)
const resolved = computed(() => data.value.address)

const catcher = function (reason) {
  setTimeout(function () {
    data.value = { loading: false, address: null, error: true, reason: reason.toString() }
  }, 1000)
}

resolve(window.location.pathname, window.location.hash)
  .then(function (address) {
    data.value = { loading: false, address, error: false, reason: null }
  }).catch(catcher)
</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content }}</template>
  </metainfo>
  <HeaderView></HeaderView>
  <main class="container mx-auto px-8 my-6 grow prose relative">
    <template v-if="loading">
      <LoadingIndicator></LoadingIndicator>
    </template>
    <template v-else-if="notFound">
      <NotFoundMessage></NotFoundMessage>
    </template>
    <template v-else>
      <AddressView :address="resolved"></AddressView>
    </template>
  </main>
  <FooterView></FooterView>
</template>
