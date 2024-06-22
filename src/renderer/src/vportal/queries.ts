import activeGroupQuery from '../../../../resources/graphql/queries/ActiveGroupQuery.gql?raw'
import profileCompetitionQuery from '../../../../resources/graphql/queries/ProfileCompetitionQuery.gql?raw'
import stageListQuery from '../../../../resources/graphql/queries/StageListQuery.gql?raw'
import competitionDataQuery from '../../../../resources/graphql/queries/CompetitionDataQuery.gql?raw'
import scoreboardQuery from '../../../../resources/graphql/queries/ScoreboardQuery.gql?raw'
import activeAthleteQuery from '../../../../resources/graphql/queries/ActiveAthleteQuery.gql?raw'
import activeGroupsOnStageQuery from '../../../../resources/graphql/queries/ActiveGroupsOnStageQuery.gql?raw'
import { gql, GraphQLClient } from 'graphql-request'
import {
  ActiveAthleteQueryResult,
  CompetitionDataQueryResult,
  ScoreboardQueryResult,
  StageListQueryResult
} from '../models/vportal'

async function activeGroupsOnStage(
  client: GraphQLClient,
  competitionId: string,
  stageId: string
): Promise<Array<string>> {
  const params = {
    competitionId: competitionId,
    params: {
      filter: {
        competitionStageId: stageId,
        active: true
      }
    }
  }
  const res = await client.request(
    gql`
      ${activeGroupsOnStageQuery}
    `,
    params
  )
  return res.competition.competitionGroupList?.competitionGroups.map((group) => group.id)
}

async function activeAthlete(
  client: GraphQLClient,
  competitionId: string,
  competitionGroupIds: Array<string>
): Promise<ActiveAthleteQueryResult> {
  const params = {
    competitionId: competitionId,
    params: {
      filter: {
        competitionGroupId: competitionGroupIds
      }
    }
  }
  return await client.request(
    gql`
      ${activeAthleteQuery}
    `,
    params
  )
}

async function profileCompetition(client: GraphQLClient): Promise<string> {
  const res = await client.request(gql`
    ${profileCompetitionQuery}
  `)
  // @ts-ignore (Response mapped to usable type)
  return res.profile.competition.id
}

async function stageList(
  client: GraphQLClient,
  competitionId: string
): Promise<StageListQueryResult> {
  const params = {
    competitionId: competitionId
  }
  const res = await client.request(
    gql`
      ${stageListQuery}
    `,
    params
  )
  return res
}

async function competitionData(
  client: GraphQLClient,
  competitionId: string
): Promise<CompetitionDataQueryResult> {
  const params = {
    competitionId: competitionId
  }
  const res = await client.request(
    gql`
      ${competitionDataQuery}
    `,
    params
  )
  return res
}

async function activeGroup(client: GraphQLClient, competitionId: string): Promise<Array<string>> {
  const params = {
    competitionId: competitionId
  }
  const res = await client.request(
    gql`
      ${activeGroupQuery}
    `,
    params
  )
  // @ts-ignore (Response mapped to usable type)
  return res.competitionGroupList.competitionGroups.map((group) => group.id)
}

async function scoreboard(
  client: GraphQLClient,
  competitionId: string,
  bodyWeightCategoryId: string
): Promise<ScoreboardQueryResult> {
  const params = {
    competitionId: competitionId,
    params: {
      filter: {
        withBodyWeight: true,
        eventBodyWeightCategoryId: bodyWeightCategoryId
      }
    }
  }
  return await client.request(
    gql`
      ${scoreboardQuery}
    `,
    params
  )
}

export {
  activeGroup,
  profileCompetition,
  stageList,
  competitionData,
  scoreboard,
  activeAthlete,
  activeGroupsOnStage
}
