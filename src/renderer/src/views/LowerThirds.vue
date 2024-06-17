<script setup>
import { onBeforeMount, onUnmounted, ref } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()

const athlete = ref({
  name: '',
  club: '',
  activeLift: '',
  compClass: '',
  total: '',
  prognosis: '',
  placement: '',
  bestSquat: '',
  bestBench: '',
  bestDeadlift: '',
  attempt1: '',
  attempt2: '',
  attempt3: '',
  attemptColor1: '',
  attemptColor2: '',
  attemptColor3: '',
  attemptStatus1: '',
  attemptStatus2: '',
  attemptStatus3: ''
})

let interval = null

function getAthlete() {
  axios.get(`http://localhost:${route.params.port}/active-athlete`).then((res) => {
    athlete.value = res.data
  })
}

function liftValid(status) {
  return status === 'valid'
}

function liftInvalid(status) {
  return status === 'invalid'
}

onBeforeMount(() => {
  getAthlete()
  interval = setInterval(getAthlete, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div
    class="flex flex-col justify-center align-middle w-full h-full content-center items-center bg-magenta"
  >
    <div id="container">
      <div class="flex flex-row rounded-lg w-full h-full px-4 py-2 gradient">
        <div class="flex flex-row w-1/2">
          <div class="flex flex-col justify-around text-white h-full w-full py-2">
            <div class="text-3xl">
              <span class="ellipses">{{ athlete.name }}</span>
            </div>
            <div class="text-xl font-light">
              <span class="ellipses">{{ athlete.club }}</span>
            </div>
            <div class="text-xl font-light">
              <span class="ellipses">{{ athlete.compClass }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-row items-center w-2/3 justify-around">
          <div class="flex flex-row justify-end justify-items-end">
            <div
              id="current-lift-name"
              class="bg-white rounded-lg p-2 font-bold flex justify-center items-center text-xl w-40 h-11 mx-1"
            >
              {{ athlete.activeLift }}
            </div>
            <div class="flex flex-row">
              <div
                id="attempt-one"
                class="bg-white rounded-lg p-2 font-bold flex justify-center items-center text-xl w-16 h-11 mx-1"
                :class="{
                  'attempt-success': liftValid(athlete.attemptStatus1),
                  'attempt-fail': liftInvalid(athlete.attemptStatus1)
                }"
              >
                {{ athlete.attempt1 }}
              </div>
              <div
                id="attempt-two"
                class="bg-white rounded-lg p-2 font-bold flex justify-center items-center text-xl w-16 h-11 mx-1"
                :class="{
                  'attempt-success': liftValid(athlete.attemptStatus2),
                  'attempt-fail': liftInvalid(athlete.attemptStatus2)
                }"
              >
                {{ athlete.attempt2 }}
              </div>
              <div
                id="attempt-three"
                class="bg-white rounded-lg p-2 font-bold flex justify-center items-center text-xl w-16 h-11 mx-1"
                :class="{
                  'attempt-success': liftValid(athlete.attemptStatus3),
                  'attempt-fail': liftInvalid(athlete.attemptStatus3)
                }"
              >
                {{ athlete.attempt3 }}
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-around h-full font-bold py-2">
            <div class="rounded-md bg-white px-2 flex flex-row w-20 justify-between">
              <div>S</div>
              <div>{{ athlete.bestSquat }}</div>
            </div>
            <div class="rounded-md bg-white px-2 flex flex-row w-20 justify-between">
              <div>B</div>
              <div>{{ athlete.bestBench }}</div>
            </div>
            <div class="rounded-md bg-white px-2 flex flex-row w-20 justify-between">
              <div>D</div>
              <div>{{ athlete.bestDeadlift }}</div>
            </div>
          </div>
          <div class="flex flex-col justify-around h-full w-28">
            <div class="flex flex-row bg-white rounded-md items-center justify-between w-full">
              <div class="bg-bvdk-blue rounded-md m-0.5 px-2 text-white w-14">Total</div>
              <div class="px-2">{{ athlete.total }}</div>
            </div>
            <div class="flex flex-row bg-white rounded-md items-center justify-between w-full">
              <div class="bg-bvdk-blue rounded-md m-0.5 px-2 text-white w-14">Prog.</div>
              <div class="px-2">{{ athlete.prognosis }}</div>
            </div>
            <div class="flex flex-row bg-white rounded-md items-center justify-between w-full">
              <div class="bg-bvdk-blue rounded-md m-0.5 px-2 text-white w-14">Platz</div>
              <div class="px-2">{{ athlete.placement }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --secondary: #be0007;
  --primary: #00497f;
  --bg-white: #f4f3f2;
}

body {
  background-color: magenta;
  font-family: 'Open Sans';
  text-transform: uppercase;
  margin: 0px;
}

#container {
  width: 1300px;
  height: 120px;
  padding: 0;
  display: flex;
}

.gradient {
  background: rgb(0, 73, 127);
  background: linear-gradient(
    202deg,
    rgba(0, 73, 127, 1) 0%,
    rgba(9, 9, 121, 1) 51%,
    rgba(190, 0, 7, 1) 100%
  );
}

.ellipses {
  @apply whitespace-nowrap text-ellipsis overflow-hidden;
}

.attempt-success {
  @apply bg-green-600 text-white;
}

.attempt-fail {
  @apply bg-red-600 text-white;
}
</style>
