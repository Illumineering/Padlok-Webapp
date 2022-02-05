import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { translations } from './translations.js'
import App from './App.vue'
import './assets/tailwind.css'

const i18n = createI18n({
    fallbackLocale: 'en',
    messages: translations,
})
const app = createApp(App)
app.use(i18n)
app.mount('#app')
