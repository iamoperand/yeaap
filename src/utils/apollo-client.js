import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory';
import getConfig from 'next/config';

import { auth } from '../utils/firebase';
import introspectionQueryResultData from '../fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      switch (err.extensions.code) {
        case 'UNAUTHENTICATED':
          // error code is set to UNAUTHENTICATED
          // when AuthenticationError thrown in resolver
          console.log("You're not authenticated!");
      }
    }
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const getToken = async () => {
  // auth.currentUser won't be available on server
  const user = process.browser ? await auth.currentUser : null;
  const idToken = user ? await user.getIdToken() : null;

  return idToken;
};

const authLink = setContext(async (_, { headers }) => {
  const token = await getToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const { publicRuntimeConfig } = getConfig();
const { apiUrl, websocketUrl } = publicRuntimeConfig;

const httpLink = new HttpLink({
  uri: apiUrl,
  credentials: 'include'
});

// Make sure the wsLink is only created on the browser. The server doesn't have a native implemention for websockets
const wsLink = process.browser
  ? new WebSocketLink({
      uri: websocketUrl,
      options: {
        reconnect: true,
        lazy: true,
        connectionParams: async () => {
          const token = await getToken();
          return {
            authorization: token ? `Bearer ${token}` : ''
          };
        }
      }
    })
  : () => {
      console.log(
        `Server doesn't have a native implementation for subscriptions.`
      );
    };

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return (
      kind === 'OperationDefinition' &&
      operation === 'subscription' &&
      process.browser
    );
  },
  wsLink,
  httpLink
);

const link = ApolloLink.from([errorLink, authLink, terminatingLink]);

let apolloClient = null;
const create = (initialState) => {
  return new ApolloClient({
    link,
    cache: new InMemoryCache({
      fragmentMatcher
    }).restore(initialState || {}),
    connectToDevTools: process.browser,
    ssrMode: !process.browser // Disables forceFetch on the server (so queries are only run once)
  });
};

export const initApollo = (initialState) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
};
