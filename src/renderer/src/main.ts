import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Toast, { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const toastOptions: PluginOptions = {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true
}

createApp(App).use(router).use(store).use(Toast, toastOptions).mount('#app')
