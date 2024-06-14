import activeGroupQuery from '../../../../resources/graphql/queries/ActiveGroupQuery.gql?raw'
import profileCompetitionQuery from '../../../../resources/graphql/queries/ProfileCompetitionQuery.gql?raw'
import stageListQuery from '../../../../resources/graphql/queries/StageListQuery.gql?raw'
import competitionDataQuery from '../../../../resources/graphql/queries/CompetitionDataQuery.gql?raw'
import scoreboardQuery from '../../../../resources/graphql/queries/ScoreboardQuery.gql?raw'
import activeAthleteQuery from '../../../../resources/graphql/queries/ActiveAthleteQuery.gql?raw'
import { gql, GraphQLClient } from 'graphql-request'

async function activeAthlete(client, competitionId, competitionStageId) {
  const params = {
    competitionId: competitionId,
    params: {
      filter: {
        competitionStageId: competitionStageId
      }
    }
  }
  const res = await client.request(
    gql`
      ${activeAthleteQuery}
    `,
    params
  )
  return res.competitionAthleteAttemptList
}

async function profileCompetition(client) {
  const res = await client.request(gql`
    ${profileCompetitionQuery}
  `)
  return res.profile.competition.id
}

async function stageList(client, competitionId) {
  const params = {
    competitionId: competitionId
  }
  const res = await client.request(
    gql`
      ${stageListQuery}
    `,
    params
  )
  return res.competitionStageList
}

async function competitionData(client, competitionId) {
  const params = {
    competitionId: competitionId
  }
  const res = await client.request(
    gql`
      ${competitionDataQuery}
    `,
    params
  )
  return res.competition
}

async function activeGroup(client, competitionId) {
  const params = {
    competitionId: competitionId
  }
  const res = await client.request(
    gql`
      ${activeGroupQuery}
    `,
    params
  )
  return res.competitionGroupList.competitionGroups.map((group) => group.id)
}

async function scoreboard(client, competitionId, bodyWeightCategoryId) {
  const params = {
    competitionId: competitionId,
    params: {
      filter: {
        withBodyWeight: true,
        eventBodyWeightCategoryId: bodyWeightCategoryId
      }
    }
  }
  const res = await client.request(
    gql`
      ${scoreboardQuery}
    `,
    params
  )
  return res.competitionAthleteList
}

export { activeGroup, profileCompetition, stageList, competitionData, scoreboard, activeAthlete }
