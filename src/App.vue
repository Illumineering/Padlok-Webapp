<script setup>
import { ref, computed } from 'vue'

const identifier = '5OPWDzrVi3eUmLwp2lycUf' // TODO: get it from URL
const passphrase = 'BYhngAXAZ5o0' // TODO: get it from URL

// Main data
const data = ref({ loading: true })

// Computed properties
const loading = computed(() => data.value.hasOwnProperty('loading'))
const notFound = computed(() => data.value.hasOwnProperty('error'))

let catcher = function (reason) {
  console.error(reason);
  data.value = { error: true, reason: reason.toString() }
}

// Perform the fetch
fetch('https://dev.padlok.app/shared/' + identifier)
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
</script>

<template>
  <div v-if="loading">
    Loading…
  </div>
  <div v-else-if="notFound">
    Not Found
  </div>
  <div v-else>
    Loaded!
  </div>
</template>

<style>

</style>
