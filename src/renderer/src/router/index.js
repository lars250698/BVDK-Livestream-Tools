import { createMemoryHistory, createRouter } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import LivestreamOptionsView from '../views/LivestreamOptionsView.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/options', component: LivestreamOptionsView },
  { path: '/login', component: LoginView }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
