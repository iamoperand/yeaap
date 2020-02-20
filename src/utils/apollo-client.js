import ApolloClient from 'apollo-boost';
import fetch from 'node-fetch';

import { auth } from './firebase';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  fetch,
  request: async (operation) => {
    const user = auth.currentUser;
    const idToken = user ? await user.getIdToken() : null;

    operation.setContext({
      headers: {
        authorization: idToken ? `Bearer ${idToken}` : ''
      }
    });
  }
});

export default client;
