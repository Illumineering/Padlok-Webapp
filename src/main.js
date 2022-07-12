import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createMetaManager, defaultConfig } from 'vue-meta'
import { translations, detectLanguage } from './translations.js'
import App from './App.vue'
import './assets/tailwind.css'

const i18n = createI18n({
    legacy: false,
    locale: detectLanguage() || 'en',
    fallbackLocale: 'en',
    messages: translations,
})
const metaManager = createMetaManager(false, {
    ...defaultConfig,
    meta: { tag: 'meta', nameless: true },
});
const app = createApp(App)
app.use(i18n)
app.use(metaManager)
app.mount('#app')
