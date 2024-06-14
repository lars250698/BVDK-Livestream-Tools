import { createStore } from 'vuex'
import axios from 'axios'
import qs from 'qs'
import router from '../router'

let state = {
  token: null,
  gqlClient: null,
  applicationState: null
}

const getters = {
  isLoggedIn: (state) => {
    return state.token != null
  }
}

const actions = {
  logIn({ commit }, input) {
    axios.post('/auth/login', qs.stringify(input)).then(({ data }) => {
      commit('setApplicationState', data)
      router.push('/options')
    })
  }
}

const mutations = {
  setApplicationState(state, applicationState) {
    state.applicationState = applicationState
  },
  setToken(state, token) {
    state.token = token
  },
  setGqlClient(state, client) {
    state.gqlClient = client
  }
}
export default createStore({
  state,
  getters,
  actions,
  mutations
})
