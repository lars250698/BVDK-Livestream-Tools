import { activeAthlete, scoreboard } from './queries'

const colorValid = '#00ff00ff'
const colorInvalid = '#ff0000ff'
const colorOpen = '#ffffff00'

async function getOverallScoreboard(client, state) {
  const scoreboardData = await scoreboard(
    client,
    state.competitionId,
    state.overallScoreboardSettings.selectedBodyWeightCategoryId
  )
  return scoreboardData.competitionAthletes.map((athlete) => {
    return {
      name: `${athlete.firstName} ${athlete.lastName}`,
      lot: athlete.lot,
      bodyWeight: prettyPrintWeight(athlete.bodyWeight),
      total: prettyPrintWeight(athlete.calcTotal),
      prognosis: prettyPrintWeight(athlete.calcTotal),
      bestSquat: prettyPrintWeight(athlete.squatTotal),
      bestBench: prettyPrintWeight(athlete.benchPressTotal),
      bestDeadlift: prettyPrintWeight(athlete.deadliftTotal)
    }
  })
}

async function getSquatScoreboard(client, state) {
  const scoreboardData = await scoreboard(
    client,
    state.competitionId,
    state.squatScoreboardSettings.selectedBodyWeightCategoryId
  )

  return scoreboardData.competitionAthletes.map((athlete) => {
    const attempts = filterAndSortAttempts(athlete.competitionAthleteAttempts, 'squat')
    return {
      name: `${athlete.firstName} ${athlete.lastName}`,
      lot: athlete.lot,
      bodyWeight: prettyPrintWeight(athlete.bodyWeight),
      total: prettyPrintWeight(athlete.calcTotal),
      prognosis: prettyPrintWeight(athlete.calcTotal),
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
}

async function getBenchScoreboard(client, state) {
  const scoreboardData = await scoreboard(
    client,
    state.competitionId,
    state.benchPressScoreboardSettings.selectedBodyWeightCategoryId
  )

  return scoreboardData.competitionAthletes.map((athlete) => {
    const attempts = filterAndSortAttempts(athlete.competitionAthleteAttempts, 'benchPress')
    return {
      name: `${athlete.firstName} ${athlete.lastName}`,
      lot: athlete.lot,
      bodyWeight: prettyPrintWeight(athlete.bodyWeight),
      total: prettyPrintWeight(athlete.calcTotal),
      prognosis: prettyPrintWeight(athlete.calcTotal),
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
}

async function getDeadliftScoreboard(client, state) {
  const scoreboardData = await scoreboard(
    client,
    state.competitionId,
    state.deadliftScoreboardSettings.selectedBodyWeightCategoryId
  )

  return scoreboardData.competitionAthletes.map((athlete) => {
    const attempts = filterAndSortAttempts(athlete.competitionAthleteAttempts, 'deadlift')
    return {
      name: `${athlete.firstName} ${athlete.lastName}`,
      lot: athlete.lot,
      bodyWeight: prettyPrintWeight(athlete.bodyWeight),
      total: prettyPrintWeight(athlete.calcTotal),
      prognosis: prettyPrintWeight(athlete.calcTotal),
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
    prognosis: prettyPrintWeight(athlete.calcTotal),
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
  return scoreboard.competitionAthletes.map((athlete) => athlete.id).indexOf(athleteId)
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
