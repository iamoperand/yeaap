/* eslint-disable react/jsx-no-bind */
import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { isEmpty } from 'lodash';
import { useToasts } from 'react-toast-notifications';

import {
  modalBasic,
  modalBorder,
  modalCentered,
  modalOverlay,
  modalPadding
} from '../../styles/modal';
import { labelBasic } from '../../styles/form';
import { buttonRounded, buttonWhite } from '../../styles/button';

import rem from '../../utils/rem';
import firebase from '../../utils/firebase';

const providerCollection = {
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

const handleSignInError = (error) => {
  if (error.code === 'auth/account-exists-with-different-credential') {
    return handleDifferentCredential({ email: error.email }).then(
      (existingProviders) => {
        return `This sign-in method is not linked to your account. Try with ${existingProviders}.`;
      }
    );
  }

  return Promise.resolve(null);
};

const AuthModal = ({ onClose }) => {
  const { addToast } = useToasts();

  const loginHandler = (providerId) => () => {
    const { provider } = providerCollection[providerId];

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(() => {
        addToast(`Yay, you're signed-in!`, {
          appearance: 'success',
          autoDismiss: true
        });
        onClose();
      })
      .catch((error) => {
        console.log('sorry, there was some issue while signing in!', { error });

        handleSignInError(error).then((message) => {
          if (!isEmpty(message)) {
            addToast(message, {
              appearance: 'error'
            });
          }

          onClose();
        });
      });
  };

  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      style={{ overlay: modalOverlay }}
      css={modalContent}
    >
      <Label>Continue with:</Label>

      <CTAWrapper>
        <NormalButton
          onClick={loginHandler(firebase.auth.GoogleAuthProvider.PROVIDER_ID)}
        >
          Google
        </NormalButton>
        <NormalButton
          onClick={loginHandler(firebase.auth.FacebookAuthProvider.PROVIDER_ID)}
        >
          Facebook
        </NormalButton>
        <NormalButton
          onClick={loginHandler(firebase.auth.TwitterAuthProvider.PROVIDER_ID)}
        >
          Twitter
        </NormalButton>
      </CTAWrapper>
    </ReactModal>
  );
};

AuthModal.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default AuthModal;

/*
 ********************************************
 styled components
 ********************************************
 */

const modalContent = css`
  ${modalBasic};
  ${modalCentered};
  ${modalBorder};
  ${modalPadding};
`;

const Label = styled.label`
  ${labelBasic};
  display: block;
`;

const NormalButton = styled.button`
  ${buttonRounded};
  ${buttonWhite};

  padding: ${rem(10)} ${rem(50)};

  margin-top: ${rem(10)};
  :first-child {
    margin-top: ${rem(20)};
  }
`;

const CTAWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
