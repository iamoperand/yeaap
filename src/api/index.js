const { chain } = require('lodash');
const fs = require('fs');
const path = require('path');
const { ApolloServer, gql } = require('apollo-server-express');
const firebaseAdmin = require('firebase-admin');

const config = require('../config');
const resolvers = require('./resolvers');

const schemaDir = __dirname + '/schema/';
const typeDefs = gql(
  chain(fs.readdirSync(schemaDir))
    .filter((fn) => fn.endsWith('.gql'))
    .map((fn) => fs.readFileSync(path.join(schemaDir, fn)).toString())
    .join('\n')
    .value()
);

const attachApi = (app, httpServer) => {
  const firebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(
      config.get('firebase').credentials
    ),
    databaseURL: 'https://yeaap-1.firebaseio.com'
  });

  const hasPlayground = config.get('enablePlayground');

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    path: '/graphql',
    subscriptions: {
      path: '/graphql'
    },
    playground: hasPlayground && {
      settings: {
        'request.credentials': 'include'
      }
    },
    context: {
      firebaseApp
    },
    introspection: hasPlayground,
    tracing: hasPlayground
  });
  server.applyMiddleware({ app });
  server.installSubscriptionHandlers(httpServer);

  return app;
};

module.exports = { attachApi };
