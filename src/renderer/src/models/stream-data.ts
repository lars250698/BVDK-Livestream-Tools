import { AttemptStatus } from './vportal'

export interface ScoreboardBase {
  name: string
  lot: string
  bodyWeight: string
  total: string
  prognosis: string
}

export interface OverallScoreboardEntry extends ScoreboardBase {
  bestSquat: string
  bestBench: string
  bestDeadlift: string
}

export interface SquatScoreboardEntry extends ScoreboardBase {
  attempt1: string
  attempt2: string
  attempt3: string
  attemptColor1: string
  attemptColor2: string
  attemptColor3: string
  attemptStatus1: AttemptStatus
  attemptStatus2: AttemptStatus
  attemptStatus3: AttemptStatus
}

export interface BenchScoreboardEntry extends SquatScoreboardEntry {
  bestSquat: string
}

export interface DeadliftScoreboardEntry extends BenchScoreboardEntry {
  bestBench: string
}

export interface ActiveAthlete {
  name: string
  club: string
  activeLift: string
  compClass: string
  total: string
  prognosis: string
  placement: string
  bestSquat: string
  bestBench: string
  bestDeadlift: string
  attempt1: string
  attempt2: string
  attempt3: string
  attemptColor1: string
  attemptColor2: string
  attemptColor3: string
  attemptStatus1: AttemptStatus
  attemptStatus2: AttemptStatus
  attemptStatus3: AttemptStatus
  activeAttempt: number
}

export interface ActiveAthleteCustomTemplate extends ActiveAthlete {
  attempt1valid: boolean
  attempt2valid: boolean
  attempt3valid: boolean
  attempt1invalid: boolean
  attempt2invalid: boolean
  attempt3invalid: boolean
}
