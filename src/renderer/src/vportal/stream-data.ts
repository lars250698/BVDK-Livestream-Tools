import { activeAthlete, scoreboard } from './queries'
import { GraphQLClient } from 'graphql-request'
import { ApplicationState } from '../../../shared/models/state'
import {
  AttemptStatus,
  CompetitionAthlete,
  CompetitionAthleteAttempt,
  Discipline,
  ScoreboardQueryResult
} from '../models/vportal'
import {
  ActiveAthlete,
  BenchScoreboardEntry,
  DeadliftScoreboardEntry,
  OverallScoreboardEntry,
  SquatScoreboardEntry
} from '../models/stream-data'

const colorValid = '#00ff00ff'
const colorInvalid = '#ff0000ff'
const colorOpen = '#ffffff00'
const colorInvisible = '#00000000'

async function getOverallScoreboard(
  client: GraphQLClient,
  state: ApplicationState
): Promise<Array<OverallScoreboardEntry>> {
  const scoreboardData = (
    await scoreboard(
      client,
      state.competitionId,
      state.overallScoreboardSettings.selectedBodyWeightCategoryId
    )
  ).competitionAthleteList
  const offset =
    state.overallScoreboardSettings.pageSize * (state.overallScoreboardSettings.page - 1)
  const to = Math.min(
    offset + state.overallScoreboardSettings.pageSize,
    scoreboardData?.competitionAthletes?.length ?? 0
  )
  const subset = scoreboardData?.competitionAthletes?.slice(offset, to)
  const res =
    subset?.map((athlete) => {
      return {
        name: `${athlete.firstName} ${athlete.lastName}`,
        lot: prettyPrintLot(athlete.lot),
        bodyWeight: prettyPrintWeight(athlete.bodyWeight),
        total: prettyPrintWeight(athlete.calcTotal, '0'),
        prognosis: prettyPrintWeight(calculatePrognosis(athlete), '0'),
        bestSquat: prettyPrintWeight(athlete.squatTotal, '0'),
        bestBench: prettyPrintWeight(athlete.benchPressTotal, '0'),
        bestDeadlift: prettyPrintWeight(athlete.deadliftTotal, '0')
      }
    }) ?? []
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
    } as OverallScoreboardEntry,
    state.overallScoreboardSettings.pageSize
  )
}

async function getSquatScoreboard(
  client: GraphQLClient,
  state: ApplicationState
): Promise<Array<SquatScoreboardEntry>> {
  const scoreboardData = (
    await scoreboard(
      client,
      state.competitionId,
      state.squatScoreboardSettings.selectedBodyWeightCategoryId
    )
  ).competitionAthleteList
  const offset = state.squatScoreboardSettings.pageSize * (state.squatScoreboardSettings.page - 1)
  const to = Math.min(
    offset + state.squatScoreboardSettings.pageSize,
    scoreboardData?.competitionAthletes?.length ?? 0
  )
  const subset = scoreboardData?.competitionAthletes?.slice(offset, to)
  const res =
    subset?.map((athlete) => {
      const attempts = filterAndSortAttempts(athlete.competitionAthleteAttempts, Discipline.Squat)
      return {
        name: `${athlete.firstName} ${athlete.lastName}`,
        lot: '' + athlete.lot,
        bodyWeight: prettyPrintWeight(athlete.bodyWeight),
        total: prettyPrintWeight(athlete.calcTotal, '0'),
        prognosis: prettyPrintWeight(calculatePrognosis(athlete), '0'),
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
    }) ?? []
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
      attemptStatus1: AttemptStatus.Open,
      attemptStatus2: AttemptStatus.Open,
      attemptStatus3: AttemptStatus.Open
    } as SquatScoreboardEntry,
    state.squatScoreboardSettings.pageSize
  )
}

async function getBenchScoreboard(
  client: GraphQLClient,
  state: ApplicationState
): Promise<Array<BenchScoreboardEntry>> {
  const scoreboardData = (
    await scoreboard(
      client,
      state.competitionId,
      state.benchPressScoreboardSettings.selectedBodyWeightCategoryId
    )
  ).competitionAthleteList
  const offset =
    state.benchPressScoreboardSettings.pageSize * (state.benchPressScoreboardSettings.page - 1)
  const to = Math.min(
    offset + state.benchPressScoreboardSettings.pageSize,
    scoreboardData?.competitionAthletes?.length ?? 0
  )
  const subset = scoreboardData?.competitionAthletes?.slice(offset, to)
  const res =
    subset?.map((athlete) => {
      const attempts = filterAndSortAttempts(athlete.competitionAthleteAttempts, Discipline.Bench)
      return {
        name: `${athlete.firstName} ${athlete.lastName}`,
        lot: '' + athlete.lot,
        bodyWeight: prettyPrintWeight(athlete.bodyWeight),
        total: prettyPrintWeight(athlete.calcTotal, '0'),
        prognosis: prettyPrintWeight(calculatePrognosis(athlete), '0'),
        bestSquat: prettyPrintWeight(athlete.squatTotal, '0'),
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
    }) ?? []
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
      attemptStatus1: AttemptStatus.Open,
      attemptStatus2: AttemptStatus.Open,
      attemptStatus3: AttemptStatus.Open
    } as BenchScoreboardEntry,
    state.benchPressScoreboardSettings.pageSize
  )
}

async function getDeadliftScoreboard(
  client: GraphQLClient,
  state: ApplicationState
): Promise<Array<DeadliftScoreboardEntry>> {
  const scoreboardData = (
    await scoreboard(
      client,
      state.competitionId,
      state.deadliftScoreboardSettings.selectedBodyWeightCategoryId
    )
  ).competitionAthleteList
  const offset =
    state.deadliftScoreboardSettings.pageSize * (state.deadliftScoreboardSettings.page - 1)
  const to = Math.min(
    offset + state.deadliftScoreboardSettings.pageSize,
    scoreboardData?.competitionAthletes?.length ?? 0
  )
  const subset = scoreboardData?.competitionAthletes?.slice(offset, to)
  const res =
    subset?.map((athlete) => {
      const attempts = filterAndSortAttempts(
        athlete.competitionAthleteAttempts,
        Discipline.Deadlift
      )
      return {
        name: `${athlete.firstName} ${athlete.lastName}`,
        lot: '' + athlete.lot,
        bodyWeight: prettyPrintWeight(athlete.bodyWeight),
        total: prettyPrintWeight(athlete.calcTotal, '0'),
        prognosis: prettyPrintWeight(calculatePrognosis(athlete), '0'),
        bestSquat: prettyPrintWeight(athlete.squatTotal, '0'),
        bestBench: prettyPrintWeight(athlete.benchPressTotal, '0'),
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
    }) ?? []
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
      attempt1: '',
      attempt2: '',
      attempt3: '',
      attemptColor1: colorInvisible,
      attemptColor2: colorInvisible,
      attemptColor3: colorInvisible,
      attemptStatus1: AttemptStatus.Open,
      attemptStatus2: AttemptStatus.Open,
      attemptStatus3: AttemptStatus.Open
    } as DeadliftScoreboardEntry,
    state.deadliftScoreboardSettings.pageSize
  )
}

async function getActiveAthlete(
  client: GraphQLClient,
  state: ApplicationState
): Promise<ActiveAthlete> {
  const queryResult = await activeAthlete(
    client,
    state.competitionId,
    state.selectedCompetitionStageId
  )
  const activeAttempt = queryResult.competitionAthleteAttemptList?.competitionAthleteAttempts?.[0]
  const athlete = activeAttempt?.competitionAthlete
  if (athlete && activeAttempt) {
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
      total: prettyPrintWeight(athlete.calcTotal, '0'),
      prognosis: prettyPrintWeight(calculatePrognosis(athlete), '0'),
      placement: getPlacement(athlete.id, scoreboardResult),
      bestSquat: prettyPrintWeight(athlete.squatTotal, '0'),
      bestBench: prettyPrintWeight(athlete.benchPressTotal, '0'),
      bestDeadlift: prettyPrintWeight(athlete.deadliftTotal, '0'),
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
  return {
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
    attemptColor1: colorInvisible,
    attemptColor2: colorInvisible,
    attemptColor3: colorInvisible,
    attemptStatus1: AttemptStatus.Open,
    attemptStatus2: AttemptStatus.Open,
    attemptStatus3: AttemptStatus.Open
  }
}

function calculatePrognosis(athlete: CompetitionAthlete) {
  if (athlete.deadliftTotal && athlete.deadliftTotal > 0) {
    const upcomingAttempt = getUpcomingAttempt(
      athlete.competitionAthleteAttempts,
      Discipline.Deadlift
    )
    return (
      (athlete.squatTotal ?? 0) + (athlete.benchPressTotal ?? 0) + (upcomingAttempt?.weight ?? 0)
    )
  }
  if (athlete.benchPressTotal && athlete.benchPressTotal > 0) {
    const deadliftOpener = getUpcomingAttempt(
      athlete.competitionAthleteAttempts,
      Discipline.Deadlift
    )
    return (athlete.squatTotal ?? 0) + athlete.benchPressTotal + (deadliftOpener?.weight ?? 0)
  }
  if (athlete.squatTotal && athlete.squatTotal > 0) {
    const benchOpener = getUpcomingAttempt(athlete.competitionAthleteAttempts, Discipline.Bench)
    const deadliftOpener = getUpcomingAttempt(
      athlete.competitionAthleteAttempts,
      Discipline.Deadlift
    )
    return athlete.squatTotal + (benchOpener?.weight ?? 0) + (deadliftOpener?.weight ?? 0)
  }
  const squatOpener = getUpcomingAttempt(athlete.competitionAthleteAttempts, Discipline.Squat)
  const benchOpener = getUpcomingAttempt(athlete.competitionAthleteAttempts, Discipline.Bench)
  const deadliftOpener = getUpcomingAttempt(athlete.competitionAthleteAttempts, Discipline.Deadlift)
  return (squatOpener?.weight ?? 0) + (benchOpener?.weight ?? 0) + (deadliftOpener?.weight ?? 0)
}

function getUpcomingAttempt(
  attempts: Array<CompetitionAthleteAttempt>,
  discipline: Discipline
): CompetitionAthleteAttempt | undefined {
  const filteredAttempts = filterAndSortAttempts(attempts, discipline)
  return filteredAttempts.find((attempt) => attempt.status === 'open')
}

function padToSize<T>(arr: Array<T>, filler: T, size: number): Array<T> {
  for (let i = arr.length; i < size; i++) {
    arr.push(filler)
  }
  return arr
}

function prettyPrintDiscipline(discipline: Discipline): string {
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

function prettyPrintLot(lot?: number): string {
  if (!lot) {
    return ''
  }
  return lot.toString()
}

function prettyPrintWeight(weight?: number, defaultVal: string = ''): string {
  if (!weight) {
    return defaultVal
  }
  if (weight % 1 === 0) {
    return weight.toString()
  }
  return weight.toFixed(1)
}

function getAttemptColor(attemptStatus: AttemptStatus) {
  switch (attemptStatus) {
    case AttemptStatus.Valid:
      return colorValid
    case AttemptStatus.Invalid:
      return colorInvalid
    default:
      return colorOpen
  }
}

function getPlacement(athleteId: string, scoreboard: ScoreboardQueryResult): string {
  const idx = scoreboard.competitionAthleteList.competitionAthletes
    ?.map((athlete) => athlete.id)
    ?.indexOf(athleteId)
  const placement = idx ? idx + 1 : undefined
  return placement ? placement.toString() : '-'
}

function filterAndSortAttempts(attempts: Array<CompetitionAthleteAttempt>, discipline: Discipline) {
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
