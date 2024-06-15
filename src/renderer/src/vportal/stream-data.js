import { activeAthlete, scoreboard } from './queries'

const colorValid = '#00ff00ff'
const colorInvalid = '#ff0000ff'
const colorOpen = '#ffffff00'
const colorInvisible = '#00000000'

async function getOverallScoreboard(client, state) {
  const scoreboardData = await scoreboard(
    client,
    state.competitionId,
    state.overallScoreboardSettings.selectedBodyWeightCategoryId
  )
  const offset =
    state.overallScoreboardSettings.pageSize * (state.overallScoreboardSettings.page - 1)
  const to = Math.min(
    scoreboardData.competitionAthletes.length,
    offset + state.overallScoreboardSettings.pageSize
  )
  const subset = scoreboardData.competitionAthletes.slice(offset, to)
  const res = subset.map((athlete) => {
    return {
      name: `${athlete.firstName} ${athlete.lastName}`,
      lot: '' + athlete.lot,
      bodyWeight: prettyPrintWeight(athlete.bodyWeight),
      total: prettyPrintWeight(athlete.calcTotal),
      prognosis: prettyPrintWeight(calculatePrognosis(athlete)),
      bestSquat: prettyPrintWeight(athlete.squatTotal),
      bestBench: prettyPrintWeight(athlete.benchPressTotal),
      bestDeadlift: prettyPrintWeight(athlete.deadliftTotal)
    }
  })
  return padToSize(
    res,
    {
      name: '',
      lot: '',
      bodyWeight: '',
      total: '',
      prognosis: '',
      bestSquat: '',
      bestBench: '',
      bestDeadlift: ''
    },
    state.overallScoreboardSettings.pageSize
  )
}

async function getSquatScoreboard(client, state) {
  const scoreboardData = await scoreboard(
    client,
    state.competitionId,
    state.squatScoreboardSettings.selectedBodyWeightCategoryId
  )
  const offset = state.squatScoreboardSettings.pageSize * (state.squatScoreboardSettings.page - 1)
  const to = Math.min(
    scoreboardData.competitionAthletes.length,
    offset + state.squatScoreboardSettings.pageSize
  )
  const subset = scoreboardData.competitionAthletes.slice(offset, to)
  const res = subset.map((athlete) => {
    const attempts = filterAndSortAttempts(athlete.competitionAthleteAttempts, 'squat')
    return {
      name: `${athlete.firstName} ${athlete.lastName}`,
      lot: '' + athlete.lot,
      bodyWeight: prettyPrintWeight(athlete.bodyWeight),
      total: prettyPrintWeight(athlete.calcTotal),
      prognosis: prettyPrintWeight(calculatePrognosis(athlete)),
      attempt1: prettyPrintWeight(attempts[0].weight),
      attempt2: prettyPrintWeight(attempts[1].weight),
      attempt3: prettyPrintWeight(attempts[2].weight),
      attemptColor1: getAttemptColor(attempts[0].status),
      attemptColor2: getAttemptColor(attempts[1].status),
      attemptColor3: getAttemptColor(attempts[2].status),
      attemptStatus1: attempts[0].status,
      attemptStatus2: attempts[1].status,
      attemptStatus3: attempts[2].status
    }
  })
  return padToSize(
    res,
    {
      name: '',
      lot: '',
      bodyWeight: '',
      total: '',
      prognosis: '',
      attempt1: '',
      attempt2: '',
      attempt3: '',
      attemptColor1: colorInvisible,
      attemptColor2: colorInvisible,
      attemptColor3: colorInvisible,
      attemptStatus1: '',
      attemptStatus2: '',
      attemptStatus3: ''
    },
    state.squatScoreboardSettings.pageSize
  )
}

async function getBenchScoreboard(client, state) {
  const scoreboardData = await scoreboard(
    client,
    state.competitionId,
    state.benchPressScoreboardSettings.selectedBodyWeightCategoryId
  )
  const offset =
    state.benchPressScoreboardSettings.pageSize * (state.benchPressScoreboardSettings.page - 1)
  const to = Math.min(
    scoreboardData.competitionAthletes.length,
    offset + state.benchPressScoreboardSettings.pageSize
  )
  const subset = scoreboardData.competitionAthletes.slice(offset, to)
  const res = subset.map((athlete) => {
    const attempts = filterAndSortAttempts(athlete.competitionAthleteAttempts, 'benchPress')
    return {
      name: `${athlete.firstName} ${athlete.lastName}`,
      lot: '' + athlete.lot,
      bodyWeight: prettyPrintWeight(athlete.bodyWeight),
      total: prettyPrintWeight(athlete.calcTotal),
      prognosis: prettyPrintWeight(calculatePrognosis(athlete)),
      bestSquat: prettyPrintWeight(athlete.squatTotal),
      attempt1: prettyPrintWeight(attempts[0].weight),
      attempt2: prettyPrintWeight(attempts[1].weight),
      attempt3: prettyPrintWeight(attempts[2].weight),
      attemptColor1: getAttemptColor(attempts[0].status),
      attemptColor2: getAttemptColor(attempts[1].status),
      attemptColor3: getAttemptColor(attempts[2].status),
      attemptStatus1: attempts[0].status,
      attemptStatus2: attempts[1].status,
      attemptStatus3: attempts[2].status
    }
  })
  return padToSize(
    res,
    {
      name: '',
      lot: '',
      bodyWeight: '',
      total: '',
      prognosis: '',
      bestSquat: '',
      attempt1: '',
      attempt2: '',
      attempt3: '',
      attemptColor1: colorInvisible,
      attemptColor2: colorInvisible,
      attemptColor3: colorInvisible,
      attemptStatus1: '',
      attemptStatus2: '',
      attemptStatus3: ''
    },
    state.benchPressScoreboardSettings.pageSize
  )
}

async function getDeadliftScoreboard(client, state) {
  const scoreboardData = await scoreboard(
    client,
    state.competitionId,
    state.deadliftScoreboardSettings.selectedBodyWeightCategoryId
  )
  const offset =
    state.deadliftScoreboardSettings.pageSize * (state.deadliftScoreboardSettings.page - 1)
  const to = Math.min(
    scoreboardData.competitionAthletes.length,
    offset + state.deadliftScoreboardSettings.pageSize
  )
  const subset = scoreboardData.competitionAthletes.slice(offset, to)
  const res = subset.map((athlete) => {
    const attempts = filterAndSortAttempts(athlete.competitionAthleteAttempts, 'deadlift')
    return {
      name: `${athlete.firstName} ${athlete.lastName}`,
      lot: '' + athlete.lot,
      bodyWeight: prettyPrintWeight(athlete.bodyWeight),
      total: prettyPrintWeight(athlete.calcTotal),
      prognosis: prettyPrintWeight(calculatePrognosis(athlete)),
      bestSquat: prettyPrintWeight(athlete.squatTotal),
      bestBench: prettyPrintWeight(athlete.benchPressTotal),
      attempt1: prettyPrintWeight(attempts[0].weight),
      attempt2: prettyPrintWeight(attempts[1].weight),
      attempt3: prettyPrintWeight(attempts[2].weight),
      attemptColor1: getAttemptColor(attempts[0].status),
      attemptColor2: getAttemptColor(attempts[1].status),
      attemptColor3: getAttemptColor(attempts[2].status),
      attemptStatus1: attempts[0].status,
      attemptStatus2: attempts[1].status,
      attemptStatus3: attempts[2].status
    }
  })
  return padToSize(res, {
    name: '',
    lot: '',
    bodyWeight: '',
    total: '',
    prognosis: '',
    bestSquat: '',
    bestBench: '',
    attempt1: '',
    attempt2: '',
    attempt3: '',
    attemptColor1: colorInvisible,
    attemptColor2: colorInvisible,
    attemptColor3: colorInvisible,
    attemptStatus1: '',
    attemptStatus2: '',
    attemptStatus3: ''
  }, state.deadliftScoreboardSettings.pageSize)
}

async function getActiveAthlete(client, state) {
  const queryResult = await activeAthlete(
    client,
    state.competitionId,
    state.selectedCompetitionStageId
  )
  const activeAttempt = queryResult.competitionAthleteAttempts[0]
  const athlete = activeAttempt.competitionAthlete
  const attempts = filterAndSortAttempts(
    athlete.competitionAthleteAttempts,
    activeAttempt.discipline
  )
  const scoreboardResult = await scoreboard(
    client,
    state.competitionId,
    athlete.bodyWeightCategory.id
  )
  return {
    name: `${athlete.firstName} ${athlete.lastName}`,
    club: athlete.club.name,
    activeLift: prettyPrintDiscipline(activeAttempt.discipline),
    compClass: `${athlete.ageCategory.name} ${athlete.bodyWeightCategory.name}`,
    total: prettyPrintWeight(athlete.calcTotal),
    prognosis: prettyPrintWeight(calculatePrognosis(athlete)),
    placement: getPlacement(athlete.id, scoreboardResult),
    bestSquat: prettyPrintWeight(athlete.squatTotal),
    bestBench: prettyPrintWeight(athlete.benchPressTotal),
    bestDeadlift: prettyPrintWeight(athlete.deadliftTotal),
    attempt1: prettyPrintWeight(attempts[0].weight),
    attempt2: prettyPrintWeight(attempts[1].weight),
    attempt3: prettyPrintWeight(attempts[2].weight),
    attemptColor1: getAttemptColor(attempts[0].status),
    attemptColor2: getAttemptColor(attempts[1].status),
    attemptColor3: getAttemptColor(attempts[2].status),
    attemptStatus1: attempts[0].status,
    attemptStatus2: attempts[1].status,
    attemptStatus3: attempts[2].status
  }
}

function calculatePrognosis(athlete) {
  if (athlete.deadliftTotal > 0) {
    const upcomingAttempt = getUpcomingAttempt(athlete.competitionAthleteAttempts, 'deadlift')
    return athlete.squatTotal + athlete.benchPressTotal + upcomingAttempt.weight
  }
  if (athlete.benchPressTotal > 0) {
    const deadliftOpener = getUpcomingAttempt(athlete.competitionAthleteAttempts, 'deadlift')
    return athlete.squatTotal + athlete.benchPressTotal + deadliftOpener.weight
  }
  if (athlete.squatTotal > 0) {
    const benchOpener = getUpcomingAttempt(athlete.competitionAthleteAttempts, 'benchPress')
    const deadliftOpener = getUpcomingAttempt(athlete.competitionAthleteAttempts, 'deadlift')
    return athlete.squatTotal + benchOpener.weight + deadliftOpener.weight
  }
  const squatOpener = getUpcomingAttempt(athlete.competitionAthleteAttempts, 'squat')
  const benchOpener = getUpcomingAttempt(athlete.competitionAthleteAttempts, 'benchPress')
  const deadliftOpener = getUpcomingAttempt(athlete.competitionAthleteAttempts, 'deadlift')
  return squatOpener.weight + benchOpener.weight + deadliftOpener.weight
}

function getUpcomingAttempt(attempts, discipline) {
  const filteredAttempts = filterAndSortAttempts(attempts, discipline)
  return filteredAttempts.find((attempt) => attempt.status === 'open')
}

function padToSize(arr, filler, size) {
  for (let i = arr.length; i < size; i++) {
    arr.push(filler)
  }
  return arr
}

function prettyPrintDiscipline(discipline) {
  switch (discipline) {
    case 'squat':
      return 'Kniebeuge'
    case 'benchPress':
      return 'Bankdrücken'
    case 'deadlift':
      return 'Kreuzheben'
    default:
      return ''
  }
}

function prettyPrintWeight(weight) {
  if (weight === null) {
    return ''
  }
  if (weight % 1 === 0) {
    return '' + weight
  }
  return weight.toFixed(1)
}

function getAttemptColor(attemptStatus) {
  switch (attemptStatus) {
    case 'valid':
      return colorValid
    case 'invalid':
      return colorInvalid
    default:
      return colorOpen
  }
}

function getPlacement(athleteId, scoreboard) {
  return scoreboard.competitionAthletes.map((athlete) => athlete.id).indexOf(athleteId) + 1
}

function filterAndSortAttempts(attempts, discipline) {
  return attempts
    .filter((attempt) => attempt.discipline === discipline)
    .sort((a, b) => a.attempt - b.attempt)
}

export {
  getActiveAthlete,
  getOverallScoreboard,
  getSquatScoreboard,
  getBenchScoreboard,
  getDeadliftScoreboard
}
