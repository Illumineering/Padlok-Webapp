<script setup>
import Address from './components/Address.vue'
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import Loading from './components/Loading.vue'
import NotFound from './components/NotFound.vue'
import { ref, computed } from 'vue'

const api = 'https://dev.padlok.app' // TODO: use https://api.padlok.app

// Main data
const data = ref({ loading: true })

// Computed properties
const loading = computed(() => data.value.hasOwnProperty('loading'))
const notFound = computed(() => data.value.hasOwnProperty('error'))

let catcher = function (reason) {
  setTimeout(function () {
    data.value = { error: true, reason: reason.toString() }
  }, 1000)
}

const components = window.location.pathname.split('/').filter((el) => el !== "")
if (components.length !== 2) {
  catcher('Wrong route')
} else {
  const [identifier, passphrase] = components
  // Perform the fetch
  fetch(api + '/shared/' + identifier)
  .then(function (res) {
      res.json()
      .then(function(json) {
          if (json.hasOwnProperty('error')) {
          catcher(json.reason)
          return
          }
          let salt = Uint8Array.from(atob(json.salt), c => c.charCodeAt(0))
          let sealed = Uint8Array.from(atob(json.sealed), c => c.charCodeAt(0))
          let iterations = json.iterations
          if (!salt || !sealed || !iterations) {
          catcher('Could not decode base64 for salt or sealed')
          return
          }
          let nonce = sealed.slice(0, 16)
          let ciphertext = sealed.slice(16)

          let enc = new TextEncoder();
          crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveBits", "deriveKey"])
          .then(function (keyMaterial) {
              let keyInfos = {
              "name": "PBKDF2",
              "salt": salt,
              "iterations": iterations,
              "hash": "SHA-256"
              }
              let keyOutput = {
              "name": "AES-GCM",
              "length": 256
              }
              crypto.subtle.deriveKey(keyInfos, keyMaterial, keyOutput, true, ["encrypt", "decrypt"])
              .then(function (key) {
                  let aes = {
                  "name": "AES-GCM",
                  "iv": nonce
                  }
                  crypto.subtle.decrypt(aes, key, ciphertext)
                  .then(function (decrypted) {
                      let decoder = new TextDecoder()
                      do {
                      // Try to jsonify. If it doesn't, remove last character and try again
                      try {
                          data.value = JSON.parse(decoder.decode(decrypted))
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
  <Header></Header>
  <main class="container mx-auto px-8 my-6 grow prose relative">
  <template v-if="loading">
    <Loading></Loading>
  </template>
  <template v-else-if="notFound">
    <NotFound></NotFound>
  </template>
  <template v-else>
    <Address :data="data"></Address>
  </template>
  </main>
  <Footer></Footer>
</template>
