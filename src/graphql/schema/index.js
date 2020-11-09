const { gql } = require('apollo-server-express');
const userSchema = require('./user');
const messageSchema = require('./message');

const stitchedSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

module.exports = [stitchedSchema, userSchema, messageSchema];