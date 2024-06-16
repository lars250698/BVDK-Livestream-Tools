import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import LivestreamOptionsView from '../views/LivestreamOptionsView.vue'
import LowerThirds from '../views/LowerThirds.vue'
import Scoreboard from '../views/Scoreboard.vue'
import ScoreboardSquat from '../views/ScoreboardSquat.vue'
import ScoreboardBench from '../views/ScoreboardBench.vue'
import ScoreboardDeadlift from '../views/ScoreboardDeadlift.vue'

const defaultTitle = 'BVDK Livestream Tools'

const routes = [
  { name: 'entry', path: '/', component: LoginView },
  { name: 'options', path: '/options', component: LivestreamOptionsView },
  { name: 'login', path: '/login', component: LoginView },
  {
    name: 'lower-thirds',
    path: '/stream/lower-thirds/:port',
    component: LowerThirds,
    meta: { title: 'Athletenanzeige' }
  },
  {
    name: 'scoreboard-overall',
    path: '/scoreboard/overall/:port',
    component: Scoreboard,
    meta: { title: 'Scoreboard overall' }
  },
  {
    name: 'scoreboard-squat',
    path: '/scoreboard/squat/:port',
    component: ScoreboardSquat,
    meta: { title: 'Scoreboard Squat' }
  },
  {
    name: 'scoreboard-bench',
    path: '/scoreboard/bench/:port',
    component: ScoreboardBench,
    meta: { title: 'Scoreboard Bench' }
  },
  {
    name: 'scoreboard-deadlift',
    path: '/scoreboard/deadlift/:port',
    component: ScoreboardDeadlift,
    meta: { title: 'Scoreboard Deadlift' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  console.log(to.meta.title)
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = defaultTitle
  }
  next()
})

export default router
