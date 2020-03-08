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
import firebase, { auth } from '../../utils/firebase';
import { handleSignInError, providerCollection } from '../../utils/auth';

const Auth = ({ onClose }) => {
  const { addToast } = useToasts();

  const loginHandler = (providerId) => () => {
    const { provider } = providerCollection[providerId];

    auth
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

Auth.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default Auth;

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
