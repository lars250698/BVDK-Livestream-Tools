import { GraphQLClient } from 'graphql-request'

function createClient(url, token) {
  return new GraphQLClient(url, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })
}

export { createClient }
