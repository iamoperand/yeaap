const { chain, split, toLower } = require('lodash');
const fs = require('fs');
const path = require('path');
const { ApolloServer, gql } = require('apollo-server-express');
const firebaseAdmin = require('firebase-admin');
const createStripe = require('stripe');

const config = require('../config');
const resolvers = require('./resolvers');
const directives = require('./directives');
const User = require('./user');
const SettlementProcessor = require('./settlement-processor');

const schemaDir = __dirname + '/schema/';
const typeDefs = gql(
  chain(fs.readdirSync(schemaDir))
    .filter((fn) => fn.endsWith('.gql'))
    .map((fn) => fs.readFileSync(path.join(schemaDir, fn)).toString())
    .join('\n')
    .value()
);

const buildContext = (defaults) => async ({ req, connection }) => {
  const { db, auth } = defaults;

  const context = {
    ...defaults,
    request: {
      ip: req.ip,
      userAgent: req.headers['user-agent']
    },
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

    const id = data.uid;
    const users = db.collection('users');

    const firestoreUser = await users
      .doc(id)
      .get()
      .then((doc) =>
        doc.exists
          ? doc
          : users
              .doc(id)
              .set({ id })
              .then(() => users.doc(id).get())
      )
      .then((doc) => doc.data());

    return { ...context, user: new User({ ...data, firestoreUser }, db) };
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
  const stripe = createStripe(config.get('stripe').apiKey);
  const processor = new SettlementProcessor(
    config.get('redis').url,
    config.get('env').isProduction ? 100 : 3,
    config.get('payment').fee
  );

  const hasPlayground = config.get('enable').playground;

  const contextDefaults = {
    db,
    auth,
    stripe
  };

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
    context: buildContext(contextDefaults),
    introspection: hasPlayground,
    tracing: hasPlayground
  });
  server.applyMiddleware({ app });
  server.installSubscriptionHandlers(httpServer);

  processor.startWithContext(contextDefaults);

  return app;
};

module.exports = { attachApi };
