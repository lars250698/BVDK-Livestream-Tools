<script setup lang="ts">
import { useStore } from 'vuex'
import Loading from 'vue-loading-overlay'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import { createClient } from '../../vportal/client'
import { initState } from '../../vportal/state-actions'
import { Credentials } from '../../../../shared/models/credentials'

const store = useStore()
const router = useRouter()
const toast = useToast()

const input = ref({
  identity: '',
  credential: ''
})
const saveCredentials = ref(false)
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
      if (saveCredentials.value) {
        saveLoginInfo()
      }
      store.commit('setToken', res.data.token)
      const gqlClient = createClient(store.state.appSettings.vportalUrl, store.state.token)
      initState(gqlClient)
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
      if (err?.response?.status === 401) {
        toast.error('Wrong login data!')
      } else {
        toast.error('An error occurred during login.')
      }
      console.error(err)
    })
}

function saveLoginInfo() {
  window.credentials.storageAvailable().then((storageAvailable) => {
    if (storageAvailable) {
      window.credentials.write({
        identity: input.value.identity,
        credential: input.value.credential
      } as Credentials)
    }
  })
}

onMounted(() => {
  window.credentials
    .available()
    .then((available) => {
      if (available) {
        window.credentials
          .load()
          .then((credentials: Credentials) => {
            input.value.identity = credentials.identity
            input.value.credential = credentials.credential
            saveCredentials.value = true
            login()
          })
          .catch((err) => console.error(err))
      }
    })
    .catch((err) => console.error(err))
})
</script>

<template>
  <loading
    v-model:active="isLoading"
    :can-cancel="false"
    :is-full-page="true"
    :opacity="1"
    :background-color="'#082f49'"
    :color="'#9ca3af'"
  />
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
      <div class="flex items-center my-2">
        <input
          id="save-login"
          v-model="saveCredentials"
          type="checkbox"
          class="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
        />
        <label for="save-login" class="ms-2 text-sm font-medium text-gray-300"
        >Save login</label
        >
      </div>
      <div class="my-4">
        <button type="button" class="btn-primary w-full" @click.prevent="login">Log In</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.label {
  @apply block mb-2 text-sm font-medium text-white;
}

.input {
  @apply border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500;
}

.btn-primary {
  @apply text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800;
}

.btn-secondary {
  @apply border focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700;
}
</style>
