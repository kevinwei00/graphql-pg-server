const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    messages: [Message!]!
    message(id: ID!): Message!
  }

  extend type Mutation {
    createMessage(input: MessageInput!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }

  input MessageInput {
    text: String!
    user_id: ID!
  }
`;