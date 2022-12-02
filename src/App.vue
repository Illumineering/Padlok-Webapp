<script setup>
import AddressView from './components/AddressView.vue'
import FooterView from './components/FooterView.vue'
import HeaderView from './components/HeaderView.vue'
import LoadingIndicator from './components/LoadingIndicator.vue'
import NotFoundMessage from './components/NotFoundMessage.vue'
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

const api = 'https://api.padlok.app'

// Main data
const data = ref({ loading: true, address: null, error: false, reason: null })

// Computed properties
const loading = computed(() => data.value.loading)
const notFound = computed(() => data.value.error)
const address = computed(() => data.value.address)

const catcher = function (reason) {
  setTimeout(function () {
    data.value = { loading: false, address: null, error: true, reason: reason.toString() }
  }, 1000)
}

const components = window.location.pathname.split('/').filter((el) => el !== '')
let identifier, passphrase

// Get passphrase from uri fragment
if (components.length === 1 && window.location.hash) {
  [identifier] = components
  passphrase = window.location.hash.substring(1)
}

// Legacy links management
if (components.length === 2) {
  [identifier, passphrase] = components
}

if (!identifier || !passphrase) {
  catcher('Wrong route')
} else {
  // Perform the fetch
  fetch(api + '/shared/' + identifier)
    .then(function (res) {
      res.json()
        .then(function (json) {
          if (json.error) {
            catcher(json.reason)
            return
          }
          const salt = Uint8Array.from(atob(json.salt), c => c.charCodeAt(0))
          const sealed = Uint8Array.from(atob(json.sealed), c => c.charCodeAt(0))
          const iterations = json.iterations
          if (!salt || !sealed || !iterations) {
            catcher('Could not decode base64 for salt or sealed')
            return
          }
          const nonce = sealed.slice(0, 16)
          const ciphertext = sealed.slice(16)

          const enc = new TextEncoder()
          crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveBits', 'deriveKey'])
            .then(function (keyMaterial) {
              const keyInfo = {
                name: 'PBKDF2',
                salt,
                iterations,
                hash: 'SHA-256'
              }
              const keyOutput = {
                name: 'AES-GCM',
                length: 256
              }
              crypto.subtle.deriveKey(keyInfo, keyMaterial, keyOutput, true, ['encrypt', 'decrypt'])
                .then(function (key) {
                  const aes = {
                    name: 'AES-GCM',
                    iv: nonce
                  }
                  crypto.subtle.decrypt(aes, key, ciphertext)
                    .then(function (decrypted) {
                      const decoder = new TextDecoder()
                      do {
                        // Try to jsonify. If it doesn't, remove last character and try again
                        try {
                          data.value.data = JSON.parse(decoder.decode(decrypted))
                          break
                        } catch {
                          decrypted = decrypted.slice(0, decrypted.byteLength - 1)
                        }
                      } while (decrypted.byteLength)
                    }).catch(catcher)
                }).catch(catcher)
            }).catch(catcher)
        }).catch(catcher)
    }).catch(catcher)
}
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
      <AddressView :address="address"></AddressView>
    </template>
  </main>
  <FooterView></FooterView>
</template>
