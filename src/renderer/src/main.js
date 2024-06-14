import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

axios.defaults.baseURL = 'https://818wrx6ocb.execute-api.eu-central-1.amazonaws.com/default'

const toastOptions = {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true
}

createApp(App).use(router).use(store).use(Toast, toastOptions).mount('#app')
