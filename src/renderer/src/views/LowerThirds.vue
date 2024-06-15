<script setup>
import { onBeforeMount, onUnmounted, ref } from 'vue'
import axios from 'axios'

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
  axios.get('http://localhost:8000/active-athlete').then((res) => {
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
    class="flex flex-col justify-center align-middle w-full h-full content-center items-center bg-green-500"
  >
    <div id="container">
      <div class="flex flex-row rounded-lg w-full h-full px-4 py-2 gradient">
        <div class="flex flex-row w-1/2">
          <div class="flex flex-col justify-around text-white h-full w-full py-2">
            <div class="text-3xl">
              <span class="elipses">{{ athlete.name }}</span>
            </div>
            <div class="text-xl font-light">
              <span class="elipses">{{ athlete.club }}</span>
            </div>
            <div class="text-xl font-light">
              <span class="elipses">{{ athlete.compClass }}</span>
            </div>
          </div>
          <div id="lifter-class" class="lifter-info subtitle"></div>
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
  padding: 0px 0px 0px;
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

#overlay {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: var(--bg-white);
  padding: 5px 30px 5px;
  background: rgb(0, 73, 127);
  background: linear-gradient(
    202deg,
    rgba(0, 73, 127, 1) 0%,
    rgba(9, 9, 121, 1) 51%,
    rgba(190, 0, 7, 1) 100%
  );
  border-radius: 5px;
}

#lifter-infos {
  color: #ffffff;
  flex-grow: 3;
  width: 40%;
}

#lift-infos {
  display: flex;
  justify-content: end;
  align-items: center;
  height: 80%;
  width: 60%;
}

.elipses {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title {
  font-size: 30px;
  text-transform: uppercase;
}

.subtitle {
  font-size: 15px;
  font-weight: light;
  text-transform: uppercase;
}

.box {
  background-color: var(--bg-white);
  border-radius: 5px;
  margin: 5px;
  padding: 6px 12px 6px;
}

#current-lift {
  display: flex;
  align-items: center;
  justify-content: end;
  height: 100%;
  margin-right: 10px;
}

.current-lift {
  font-size: x-large;
  font-weight: bold;
  color: black;
  height: 45%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#attempts {
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
  height: 100%;
}

.attempt {
  width: 52px;
}

.attempt-success {
  background-color: green;
  color: white;
}

.attempt-fail {
  background-color: red;
  color: white;
}

.attempt-ongoing {
  -webkit-box-shadow: inset 0px 0px 0px 2px white;
  -moz-box-shadow: inset 0px 0px 0px 2px white;
  box-shadow: inset 0px 0px 0px 2px white;
  background-color: var(--primary);
  color: white;
}

#lifter-infos {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

#lifter-name {
  display: flex;
  align-items: end;
}

.lifter-info {
  width: 100%;
  margin-bottom: 1px;
}

#current-lift {
  height: 100%;
  align-items: center;
  display: flex;
}

#best-lifts {
  display: flex;
  flex-direction: column;
  font-size: medium;
  margin-right: 10px;
}

.best-lift-letter {
  font-weight: bold;
  margin-right: 12px;
}

.best-lift-container {
  display: flex;
  justify-content: space-between;
}

.box.best-lift-container {
  padding: 2px 15px 2px;
  border-radius: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
}

.subtotal-forecast {
  display: flex;
  justify-content: start;
  align-items: center;
  font-size: medium;
}

.box.subtotal-forecast {
  padding: 2px;
  padding-right: 15px;
}

.subtotal-forecast-name {
  background-color: var(--primary);
  color: white;
  border-radius: 5px;
  padding: 3px 8px 3px;
  margin-right: 15px;
}
</style>
