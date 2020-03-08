import React from 'react';
import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/core';
import { cache } from 'emotion';
import { ModalProvider } from 'react-modal-hook';
import { ToastProvider } from 'react-toast-notifications';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import getConfig from 'next/config';

import { AuthProvider } from './auth-context';

const { publicRuntimeConfig } = getConfig();

const ELEMENTS_OPTIONS = {
  fonts: [
    {
      cssSrc: 'https://fonts.googleapis.com/css?family=Roboto'
    }
  ]
};

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripe = loadStripe(publicRuntimeConfig.stripePublishableKey);

function AppProviders({ children }) {
  return (
    <Elements stripe={stripe} options={ELEMENTS_OPTIONS}>
      <ToastProvider>
        <ModalProvider>
          <AuthProvider>
            <CacheProvider value={cache}>{children}</CacheProvider>
          </AuthProvider>
        </ModalProvider>
      </ToastProvider>
    </Elements>
  );
}
AppProviders.propTypes = {
  children: PropTypes.node
};

export default AppProviders;
