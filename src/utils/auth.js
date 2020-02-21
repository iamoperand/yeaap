import { isEmpty } from 'lodash';

import firebase from './firebase';

export const providerCollection = {
  [firebase.auth.GoogleAuthProvider.PROVIDER_ID]: {
    label: 'Google',
    provider: new firebase.auth.GoogleAuthProvider()
  },
  [firebase.auth.FacebookAuthProvider.PROVIDER_ID]: {
    label: 'Facebook',
    provider: new firebase.auth.FacebookAuthProvider()
  },
  [firebase.auth.TwitterAuthProvider.PROVIDER_ID]: {
    label: 'Twitter',
    provider: new firebase.auth.TwitterAuthProvider()
  }
};

const stringifyProviders = (providers) => {
  return providers.reduce((finalStr, providerId) => {
    if (isEmpty(finalStr)) {
      return `${providerCollection[providerId].label}`;
    }
    return `${finalStr}, ${providerCollection[providerId].label}`;
  }, '');
};

const handleDifferentCredential = ({ email }) => {
  return firebase
    .auth()
    .fetchSignInMethodsForEmail(email)
    .then((providers) => {
      return stringifyProviders(providers);
    })
    .catch(() => {
      console.log('You just caught a bug!');
    });
};

export const handleSignInError = (error) => {
  if (error.code === 'auth/account-exists-with-different-credential') {
    return handleDifferentCredential({ email: error.email }).then(
      (existingProviders) => {
        return `This sign-in method is not linked to your account. Try with ${existingProviders}.`;
      }
    );
  }

  return Promise.resolve(null);
};
