<script setup>
import { ref } from 'vue'
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
const vportalUrl = 'https://staging-bvdk.vportal-online.de'

function login() {
  isLoading.value = true
  axios
    .get('/vportal-auth-proxy', {
      params: { username: input.value.identity, password: input.value.credential, url: vportalUrl }
    })
    .then((res) => {
      store.commit('setToken', res.data.token)
      const gqlClient = createClient(store.state.token)
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
      toast.error('Wrong login data!')
      console.error(err)
    })
}
</script>

<template>
  <div class="max-h-screen h-full w-full overflow-hidden">
    <div class="w-1/3 my-6 mx-auto p-3 border-2 rounded-lg shadow-md font-sans">
      <loading v-model:active="isLoading" :can-cancel="false" :is-full-page="fullPage" />
      <h2 class="pb-4 text-xl">Vereinsportal Login</h2>
      <form>
        <div class="form-group">
          <label for="username">Username</label>
          <input
            v-model="input.identity"
            placeholder="Enter your username"
            type="text"
            id="username"
            name="username"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="input.credential"
            placeholder="Enter your password"
            type="password"
            id="password"
            name="password"
          />
        </div>
        <div class="">
          <button
            @click.prevent="login"
            class="w-full p-3 bg-blue-950 hover:bg-blue-700 text-white cursor-pointer rounded-lg"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-group {
  @apply mb-6;
}

.form-group label {
  @apply block;
  @apply text-sm;
  @apply font-extralight;
}

.form-group input {
  @apply !outline-none;
  @apply w-full;
  @apply p-1;
  @apply mt-2;
  @apply text-sm;
  @apply border-b;
  @apply border-blue-950;
  @apply focus:border-blue-700 focus:border-b focus:ring-0;
}

.form-group button {
  @apply w-full;
  @apply bg-blue-950;
  @apply hover:bg-blue-700;
  @apply text-white;
  @apply cursor-pointer;
  @apply rounded-lg;
}
</style>
