import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { translations, detectLanguage } from './translations.js'
import App from './App.vue'
import './assets/tailwind.css'

const locale = detectLanguage()
document.documentElement.lang = locale
const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  // Languages leave out on purpose what English already says for all of them.
  fallbackWarn: false,
  missingWarn: false,
  messages: translations
})
const app = createApp(App)
app.use(i18n)
app.mount('#app')
