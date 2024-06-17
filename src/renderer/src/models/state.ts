import { GraphQLClient } from 'graphql-request'

export interface State {
  token: string | undefined
  gqlClient: GraphQLClient | undefined
  applicationState: ApplicationState | undefined
  appSettings: AppSettings
}

export interface AppSettings {
  vportalUrl: string
  loginProxyUrl: string
  apiPort: number
}

export interface ApplicationState {
  competitionId: string
  availableCompetitionStages: CompetitionStage[]
  selectedCompetitionStageId: string
  availableGroups: CompetitionGroup[]
  activeGroupIds: string[]
  overallScoreboardSettings: ScoreboardSettings
  squatScoreboardSettings: ScoreboardSettings
  benchPressScoreboardSettings: ScoreboardSettings
  deadliftScoreboardSettings: ScoreboardSettings
}

export interface BodyWeightCategory {
  id: string
  name: string
  ageCategoryName: string
}

export interface CompetitionGroup {
  id: string
  name: string
  bodyWeightCategories: BodyWeightCategory[]
}

export interface CompetitionStage {
  id: string
  name: string
}
export interface ScoreboardSettings {
  selectedBodyWeightCategoryId: string
  availablePages: number
  page: number
  pageSize: number
}
