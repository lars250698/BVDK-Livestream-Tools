export const enum Discipline {
  Squat = 'squat',
  Bench = 'benchPress',
  Deadlift = 'deadlift'
}

export const enum AttemptStatus {
  Open = 'open',
  Valid = 'valid',
  Invalid = 'invalid',
  Repeat = 'repeat',
  Skip = 'skip'
}

export interface CompetitionAthleteAttempt {
  weight: number | undefined
  status: AttemptStatus
  discipline: Discipline
  attempt: number
}

export interface CompetitionAthlete {
  id: string
  firstName: string
  lastName: string
  lot: number | undefined
  bodyWeight: number | undefined
  total: number | undefined
  calcTotal: number | undefined
  squatTotal: number | undefined
  benchPressTotal: number | undefined
  deadliftTotal: number | undefined
  club: {
    name: string
  }
  ageCategory: {
    name: string
  }
  bodyWeightCategory: {
    id: string
    name: string
  }
  competitionAthleteAttempts: [CompetitionAthleteAttempt]
}

export interface ActiveAthleteQueryResult {
  competitionAthleteAttemptList: {
    competitionAthleteAttempts:
      | [
          {
            discipline: Discipline
            competitionAthlete: CompetitionAthlete
          }
        ]
      | undefined
  }
}

export interface ScoreboardQueryResult {
  competitionAthleteList: {
    competitionAthletes: [CompetitionAthlete] | undefined
  }
}

export interface StageListQueryResult {
  competitionStageList: {
    competitionStages:
      | [
          {
            id: string
            name: string
          }
        ]
      | undefined
  }
}

export interface CompetitionDataQueryResult {
  competition: {
    eventBodyWeightCategoryList: {
      eventBodyWeightCategories:
        | [
            {
              id: string
              name: string
              eventAgeCategory: {
                name: string
              }
            }
          ]
        | undefined
    }
    competitionGroupList: {
      competitionGroups:
        | [
            {
              id: string
              name: string
              description: string | undefined
              eventBodyWeightCategoryList: {
                eventBodyWeightCategories: [
                  {
                    id: string
                    name: string
                    eventAgeCategory: {
                      name: string
                    }
                  }
                ]
              }
            }
          ]
        | undefined
    }
  }
}
