import React from 'react';
import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/core';
import { cache } from 'emotion';
import { ApolloProvider } from '@apollo/react-hooks';
import { ModalProvider } from 'react-modal-hook';
import { ToastProvider } from 'react-toast-notifications';

import { AuthProvider } from './auth-context';
import apolloClient from '../utils/apollo-client';

function AppProviders({ children }) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <ToastProvider>
          <ModalProvider>
            <CacheProvider value={cache}>{children}</CacheProvider>
          </ModalProvider>
        </ToastProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
AppProviders.propTypes = {
  children: PropTypes.node
};

export default AppProviders;
