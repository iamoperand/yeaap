const { get, chain, split, toLower } = require('lodash');
const fs = require('fs');
const path = require('path');
const { ApolloServer, gql } = require('apollo-server-express');
const firebaseAdmin = require('firebase-admin');

const config = require('../config');
const resolvers = require('./resolvers');
const directives = require('./directives');

const schemaDir = __dirname + '/schema/';
const typeDefs = gql(
  chain(fs.readdirSync(schemaDir))
    .filter((fn) => fn.endsWith('.gql'))
    .map((fn) => fs.readFileSync(path.join(schemaDir, fn)).toString())
    .join('\n')
    .value()
);

class User {
  constructor(data) {
    this._data = data;
  }
  async verifyOptionsOrThrow() {
    if (!this.id) {
      throw new Error('Authentication required');
    }
  }
  get id() {
    return get(this._data, 'uid', null);
  }
}

const buildContext = ({ auth, db }) => async ({ req, connection }) => {
  const context = {
    auth,
    db,
    user: new User()
  };

  const authorization = connection
    ? connection.context.authorization
    : req.headers.authorization;

  if (!authorization) {
    return context;
  }

  //
  // :: Authorize
  //

  const [type, token] = split(authorization, ' ');

  if (toLower(type) !== 'bearer' || !token) {
    throw new Error('Bad Request');
  }

  try {
    const data = await auth
      .verifyIdToken(token)
      .then(({ uid }) => auth.getUser(uid));

    return { ...context, user: new User(data) };
  } catch (error) {
    const graphqlError = new Error(error);

    if (error.errorInfo) {
      graphqlError.code = error.errorInfo.code;
    }

    throw graphqlError;
  }
};

const attachApi = (app, httpServer) => {
  const firebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(
      config.get('firebase').credentials
    ),
    databaseURL: config.get('firebase').database.url
  });
  const db = firebaseApp.firestore();
  const auth = firebaseApp.auth();

  const hasPlayground = config.get('enable').playground;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives: directives,
    path: '/graphql',
    subscriptions: {
      path: '/graphql'
    },
    playground: hasPlayground && {
      settings: {
        'request.credentials': 'include'
      }
    },
    context: buildContext({ auth, db }),
    introspection: hasPlayground,
    tracing: hasPlayground
  });
  server.applyMiddleware({ app });
  server.installSubscriptionHandlers(httpServer);

  return app;
};

module.exports = { attachApi };
