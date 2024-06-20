import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteLocation,
  RouteRecordRaw
} from 'vue-router'
import LoginView from '../views/LoginView.vue'
import LivestreamOptionsView from '../views/LivestreamOptionsView.vue'
import LowerThirds from '../views/LowerThirds.vue'
import Scoreboard from '../views/Scoreboard.vue'
import Logout from '../views/Logout.vue'

const defaultTitle = 'BLT'

const routes: Array<RouteRecordRaw> = [
  { name: 'entry', path: '/', redirect: '/login' },
  { name: 'options', path: '/options', component: LivestreamOptionsView },
  { name: 'login', path: '/login', component: LoginView },
  { name: 'logout', path: '/logout', component: Logout },
  {
    name: 'lower-thirds',
    path: '/stream/lower-thirds/:port',
    component: LowerThirds,
    meta: { title: 'Athletenanzeige' }
  },
  {
    name: 'scoreboard',
    path: '/scoreboard',
    component: Scoreboard,
    meta: { title: 'Scoreboard' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to: RouteLocation, _: RouteLocation, next: NavigationGuardNext) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  } else {
    document.title = defaultTitle
  }
  next()
})

export default router
