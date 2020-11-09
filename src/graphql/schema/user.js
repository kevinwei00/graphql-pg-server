const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
  }

  type User {
    id: ID!
    user_name: String!
    messages: [Message!]
  }
`;