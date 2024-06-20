export const defaultAppSettings: AppSettings = {
  vportalUrl: 'https://bvdk.vportal-online.de',
  loginProxyUrl:
    'https://818wrx6ocb.execute-api.eu-central-1.amazonaws.com/default/vportal-auth-proxy',
  apiPort: 8000
}

export const defaultColorSettings: ColorSettings = {
  bgColor: '#00ff00'
}

export interface State {
  token: string | undefined
  applicationState: ApplicationState | undefined
  appSettings: AppSettings
  colorSettings: ColorSettings
}

export interface AppSettings {
  vportalUrl: string
  loginProxyUrl: string
  apiPort: number
}

export interface ColorSettings {
  bgColor: string
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
  selectedScoreboardType: ScoreboardType
  upcomingAttemptAmount: number
}

export const enum ScoreboardType {
  Overall = 'overall',
  Squat = 'squat',
  Bench = 'bench',
  Deadlift = 'deadlift'
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
