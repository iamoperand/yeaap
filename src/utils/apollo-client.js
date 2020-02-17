import ApolloClient from 'apollo-boost';
import fetch from 'node-fetch';

import { auth } from './firebase';

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  fetch,
  request: async (operation) => {
    const idToken = await auth.currentUser.getIdToken();

    operation.setContext({
      headers: {
        authorization: idToken ? `Bearer ${idToken}` : ''
      }
    });
  }
});

export default client;
