require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const ws = require('ws');
const { Client } = require('pg');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { PostgresPubSub } = require('graphql-postgres-subscriptions');
const { useServer } = require('graphql-ws/lib/use/ws');
const { execute, subscribe } = require('graphql');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { db } = require('./db');

const PORT = 8000;
const pgPubSubClient = new Client();
pgPubSubClient.connect(err => {
  if (err) {
    console.error('connection error', err.stack);
  }
})

const schema = makeExecutableSchema({ typeDefs, resolvers });
const pubsub = new PostgresPubSub({ pgPubSubClient });
const apolloServer = new ApolloServer({
  schema,
  context: { db, pubsub }
});

const app = express();
app.use(cors()); 
apolloServer.applyMiddleware({ app });
const httpServer = http.createServer(app);
const wsServer = new ws.Server({
  server: httpServer,
  path: '/graphql'
});

httpServer.listen(PORT, () => {
  useServer(
    {
      schema,
      execute,
      subscribe
    },
    wsServer
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`)
});

// curl -X POST 'http://localhost:8000/graphql' -H 'Content-Type: application/json' -d '{ "query": "{ messages { text } }" }'