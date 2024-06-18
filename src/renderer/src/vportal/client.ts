import { GraphQLClient } from 'graphql-request'

function createClient(url: string, token: string): GraphQLClient {
  return new GraphQLClient(url + '/graphql', {
    headers: {
      authorization: `Bearer ${token}`
    }
  })
}

export { createClient }
