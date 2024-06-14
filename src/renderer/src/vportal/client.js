import { gql, GraphQLClient } from 'graphql-request'

const url = 'https://staging-bvdk.vportal-online.de/graphql'

function createClient(token) {
  return new GraphQLClient(url, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })
}

export { createClient }
