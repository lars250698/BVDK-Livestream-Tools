import { activeGroup, competitionData, profileCompetition, scoreboard, stageList } from './queries'
import { GraphQLClient } from 'graphql-request'
import {
  ApplicationState,
  BodyWeightCategory,
  CompetitionGroup,
  CompetitionStage,
  ScoreboardType
} from '../../../shared/models/state'
import { CompetitionDataQueryResult } from '../models/vportal'

async function initState(client: GraphQLClient) {
  const competitionId = await profileCompetition(client)
  const availableStages = await getAvailableStages(client, competitionId)
  const compData = await competitionData(client, competitionId)
  const groups = getAvailableGroupsFromCompData(compData)
  const activeGroupIds = await activeGroup(client, competitionId)
  const defaultBodyWeightCategory =
    compData.competition.competitionGroupList?.competitionGroups?.[0].eventBodyWeightCategoryList
      ?.eventBodyWeightCategories?.[0]?.id ?? ''
  const defaultPageSize = 14
  const defaultBodyWeightCategoryScoreboardPages = await getAvailablePages(
    client,
    competitionId,
    defaultBodyWeightCategory,
    defaultPageSize
  )
  return {
    competitionId: competitionId,
    availableCompetitionStages: availableStages,
    selectedCompetitionStageId: availableStages[0].id,
    availableGroups: groups,
    activeGroupIds: activeGroupIds,
    selectedScoreboardType: ScoreboardType.Overall,
    upcomingAttemptAmount: 5,
    overallScoreboardSettings: {
      selectedBodyWeightCategoryId: defaultBodyWeightCategory,
      availablePages: defaultBodyWeightCategoryScoreboardPages,
      page: 1,
      pageSize: defaultPageSize
    },
    squatScoreboardSettings: {
      selectedBodyWeightCategoryId: defaultBodyWeightCategory,
      availablePages: defaultBodyWeightCategoryScoreboardPages,
      page: 1,
      pageSize: defaultPageSize
    },
    benchPressScoreboardSettings: {
      selectedBodyWeightCategoryId: defaultBodyWeightCategory,
      availablePages: defaultBodyWeightCategoryScoreboardPages,
      page: 1,
      pageSize: defaultPageSize
    },
    deadliftScoreboardSettings: {
      selectedBodyWeightCategoryId: defaultBodyWeightCategory,
      availablePages: defaultBodyWeightCategoryScoreboardPages,
      page: 1,
      pageSize: defaultPageSize
    }
  } as ApplicationState
}

async function refreshCompetitionData(client: GraphQLClient, oldState: ApplicationState) {
  const competitionId = oldState.competitionId
  const availableStages = await getAvailableStages(client, competitionId)
  const compData = await competitionData(client, competitionId)
  const groups = getAvailableGroupsFromCompData(compData)
  const activeGroupIds = await activeGroup(client, competitionId)
  oldState.availableCompetitionStages = availableStages
  oldState.availableGroups = groups
  oldState.activeGroupIds = activeGroupIds
  oldState.overallScoreboardSettings.availablePages = await getAvailablePages(
    client,
    competitionId,
    oldState.overallScoreboardSettings.selectedBodyWeightCategoryId,
    oldState.overallScoreboardSettings.pageSize
  )
  oldState.squatScoreboardSettings.availablePages = await getAvailablePages(
    client,
    competitionId,
    oldState.squatScoreboardSettings.selectedBodyWeightCategoryId,
    oldState.squatScoreboardSettings.pageSize
  )
  oldState.benchPressScoreboardSettings.availablePages = await getAvailablePages(
    client,
    competitionId,
    oldState.benchPressScoreboardSettings.selectedBodyWeightCategoryId,
    oldState.benchPressScoreboardSettings.pageSize
  )
  oldState.deadliftScoreboardSettings.availablePages = await getAvailablePages(
    client,
    competitionId,
    oldState.deadliftScoreboardSettings.selectedBodyWeightCategoryId,
    oldState.deadliftScoreboardSettings.pageSize
  )
  return oldState
}

async function getAvailableStages(
  client: GraphQLClient,
  competitionId: string
): Promise<Array<CompetitionStage>> {
  const stages = await stageList(client, competitionId)
  if (!stages.competitionStageList.competitionStages) {
    return []
  }
  return stages.competitionStageList.competitionStages.map((stage) => {
    return {
      id: stage.id,
      name: stage.name
    } as CompetitionStage
  })
}

function getAvailableGroupsFromCompData(
  compData: CompetitionDataQueryResult
): Array<CompetitionGroup> {
  return (
    compData.competition.competitionGroupList?.competitionGroups?.map((group) => {
      return {
        id: group.id,
        name: group.name,
        bodyWeightCategories: group.eventBodyWeightCategoryList.eventBodyWeightCategories.map(
          (category) => {
            return {
              id: category.id,
              name: category.name,
              ageCategoryName: category.eventAgeCategory.name
            } as BodyWeightCategory
          }
        )
      }
    }) ?? []
  )
}

async function getAvailablePages(
  client: GraphQLClient,
  competitionId: string,
  categoryId: string,
  pageSize: number
): Promise<number> {
  const res = await scoreboard(client, competitionId, categoryId)
  if (
    res.competitionAthleteList.competitionAthletes &&
    res.competitionAthleteList.competitionAthletes.length > 0
  ) {
    const pg = res.competitionAthleteList.competitionAthletes.length / pageSize
    if (pg % 1 === 0) {
      return pg
    } else {
      return pg + 1
    }
  }
  return 1
}

export { initState, refreshCompetitionData }
