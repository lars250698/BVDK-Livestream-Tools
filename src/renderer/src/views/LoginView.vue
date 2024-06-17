<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import axios from 'axios'
import { initState } from '../vportal/state-actions'
import { createClient } from '../vportal/client'
import { useToast } from 'vue-toastification'

const store = useStore()
const router = useRouter()
const toast = useToast()

const input = ref({
  identity: '',
  credential: ''
})
const isLoading = ref(false)

function login() {
  isLoading.value = true
  axios
    .get(store.state.appSettings.loginProxyUrl, {
      params: {
        username: input.value.identity,
        password: input.value.credential,
        url: store.state.appSettings.vportalUrl
      }
    })
    .then((res) => {
      store.commit('setToken', res.data.token)
      const gqlClient = createClient(
        store.state.appSettings.vportalUrl + '/graphql',
        store.state.token
      )
      store.commit('setGqlClient', gqlClient)
      initState(store.state.gqlClient)
        .then((s) => {
          store.commit('setApplicationState', s)
          router.push('/options')
        })
        .catch((err) => {
          isLoading.value = false
          toast.error('Error while fetching data from Vereinsportal')
          console.error(err)
        })
    })
    .catch((err) => {
      isLoading.value = false
      if (err.response.status === 401) {
        toast.error('Wrong login data!')
      } else {
        toast.error('An error occurred during login.')
      }
      console.error(err)
    })
}

function saveSettings() {
  window.localStorage.setItem('appSettings', JSON.stringify(store.state.appSettings))
}

function loadSettings() {
  const savedSettingsJson = window.localStorage.getItem('appSettings')
  if (savedSettingsJson) {
    store.state.appSettings = JSON.parse(savedSettingsJson)
  }
}

function resetSettings() {
  store.commit('resetAppSettings')
  saveSettings()
}

onMounted(() => {
  loadSettings()
})

onBeforeUnmount(() => {
  saveSettings()
})
</script>

<template>
  <div class="flex w-full h-full bg-sky-950 text-white">
    <loading v-model:active="isLoading" :can-cancel="false" :is-full-page="true" />
    <div class="w-full h-full flex flex-row justify-around">
      <div class="w-1/3 p-4 h-full flex flex-col justify-center">
        <form class="flex flex-col">
          <div class="my-2">
            <label for="username" class="label"> Username </label>
            <input
              id="username"
              v-model="input.identity"
              type="text"
              class="input"
              placeholder="Enter your username"
              required
            />
          </div>
          <div class="my-2">
            <label for="password" class="label"> Password </label>
            <input
              id="password"
              v-model="input.credential"
              type="password"
              class="input"
              placeholder="Enter your password"
              required
            />
          </div>
          <div class="my-4">
            <button type="button" class="btn-primary w-full" @click.prevent="login">Log In</button>
          </div>
        </form>
      </div>
      <div class="border-r border-white"></div>
      <div class="flex flex-col w-1/3 justify-center">
        <div class="my-2">
          <label for="vportal-url" class="label">Vereinsportal URL</label>
          <input
            id="vportal-url"
            v-model="store.state.appSettings.vportalUrl"
            class="input"
            type="url"
          />
        </div>
        <div class="my-2">
          <label for="login-proxy-url" class="label"
            >Login Proxy URL (leave unchanged if unsure)</label
          >
          <input
            id="login-proxy-url"
            v-model="store.state.appSettings.loginProxyUrl"
            class="input"
            type="url"
          />
        </div>
        <div class="my-2">
          <label for="api-port" class="label">API Port</label>
          <input
            id="api-port"
            v-model="store.state.appSettings.apiPort"
            class="input"
            type="number"
          />
        </div>
        <div class="my-2">
          <button type="button" class="btn-secondary w-full" @click="resetSettings">
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.label {
  @apply block mb-2 text-sm font-medium text-gray-900 dark:text-white;
}

.input {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
}

.btn-primary {
  @apply text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800;
}

.btn-secondary {
  @apply text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700;
}
</style>
