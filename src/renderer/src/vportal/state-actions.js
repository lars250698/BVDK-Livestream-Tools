import { activeGroup, competitionData, profileCompetition, scoreboard, stageList } from './queries'

async function initState(client) {
  const competitionId = await profileCompetition(client)
  const availableStages = await getAvailableStages(client, competitionId)
  const compData = await competitionData(client, competitionId)
  const groups = getAvailableGroupsFromCompData(compData)
  const activeGroupIds = await activeGroup(client, competitionId)
  const defaultBodyWeightCategory =
    compData.competitionGroupList.competitionGroups[0].eventBodyWeightCategoryList
      .eventBodyWeightCategories[0].id
  const defaultBodyWeightCategoryScoreboardPages = await getAvailablePages(
    client,
    competitionId,
    defaultBodyWeightCategory
  )
  return {
    competitionId: competitionId,
    availableCompetitionStages: availableStages,
    selectedCompetitionStageId: availableStages[0].id,
    availableGroups: groups,
    activeGroupIds: activeGroupIds,
    overallScoreboardSettings: {
      selectedBodyWeightCategoryId: defaultBodyWeightCategory,
      availablePages: defaultBodyWeightCategoryScoreboardPages,
      page: 1
    },
    squatScoreboardSettings: {
      selectedBodyWeightCategoryId: defaultBodyWeightCategory,
      availablePages: defaultBodyWeightCategoryScoreboardPages,
      page: 1
    },
    benchPressScoreboardSettings: {
      selectedBodyWeightCategoryId: defaultBodyWeightCategory,
      availablePages: defaultBodyWeightCategoryScoreboardPages,
      page: 1
    },
    deadliftScoreboardSettings: {
      selectedBodyWeightCategoryId: defaultBodyWeightCategory,
      availablePages: defaultBodyWeightCategoryScoreboardPages,
      page: 1
    }
  }
}

async function refreshCompetitionData(client, oldState) {
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
    oldState.overallScoreboardSettings.selectedBodyWeightCategoryId
  )
  oldState.squatScoreboardSettings.availablePages = await getAvailablePages(
    client,
    competitionId,
    oldState.squatScoreboardSettings.selectedBodyWeightCategoryId
  )
  oldState.benchPressScoreboardSettings.availablePages = await getAvailablePages(
    client,
    competitionId,
    oldState.benchPressScoreboardSettings.selectedBodyWeightCategoryId
  )
  oldState.deadliftScoreboardSettings.availablePages = await getAvailablePages(
    client,
    competitionId,
    oldState.deadliftScoreboardSettings.selectedBodyWeightCategoryId
  )
  return oldState
}

async function getAvailableStages(client, competitionId) {
  const stages = await stageList(client, competitionId)
  return stages.competitionStages.map((stage) => {
    return {
      id: stage.id,
      name: stage.name
    }
  })
}

function getAvailableGroupsFromCompData(compData) {
  const groups = compData.competitionGroupList.competitionGroups.map((group) => {
    return {
      id: group.id,
      name: group.name,
      bodyWeightCategories: group.eventBodyWeightCategoryList.eventBodyWeightCategories.map(
        (category) => {
          return {
            id: category.id,
            name: category.name,
            ageCategoryName: category.eventAgeCategory.name
          }
        }
      )
    }
  })
  return groups
}

async function getAvailablePages(client, competitionId, categoryId) {
  const res = await scoreboard(client, competitionId, categoryId)
  return Math.floor(res.competitionAthletes.length / 14) + 1
}

export { initState, refreshCompetitionData }
