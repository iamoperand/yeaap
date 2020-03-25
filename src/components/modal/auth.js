import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { isEmpty, noop } from 'lodash';
import { useToasts } from 'react-toast-notifications';

import {
  modalBasic,
  modalBorder,
  modalCentered,
  modalOverlay
} from '../../styles/modal';
import { labelBasic } from '../../styles/form';
import { buttonRounded } from '../../styles/button';

import rem from '../../utils/rem';
import { auth } from '../../utils/firebase';
import {
  handleSignInError,
  providerCollection,
  providerMap
} from '../../utils/auth';

import GoogleIcon from '../../assets/icons/google.svg?sprite';
import FacebookIcon from '../../assets/icons/facebook.svg?sprite';
import TwitterIcon from '../../assets/icons/twitter.svg?sprite';

const Auth = ({ onClose, onLogin = noop }) => {
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
        onLogin();
      })
      .catch((error) => {
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
      <Title>Continue with:</Title>

      <ButtonWrapper>
        <Google onClick={loginHandler(providerMap.google)}>
          <StyledGoogleIcon />
          <Text>Google</Text>
        </Google>
        <Facebook onClick={loginHandler(providerMap.facebook)}>
          <StyledFacebookIcon />
          <Text>Facebook</Text>
        </Facebook>
        <Twitter onClick={loginHandler(providerMap.twitter)}>
          <StyledTwitterIcon />
          <Text>Twitter</Text>
        </Twitter>
      </ButtonWrapper>
    </ReactModal>
  );
};

Auth.propTypes = {
  onClose: PropTypes.func.isRequired,
  onLogin: PropTypes.func
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

  width: ${rem(320)};
  padding: ${rem(40)};
`;

const Title = styled.div`
  ${labelBasic};
  display: block;
  font-size: ${rem(22)};
`;

const buttonStyles = css`
  ${buttonRounded};
  padding: ${rem(15)} 0;
  margin: ${rem(8)} 0;
  color: #fff;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${rem(15)} 0 0;
  text-align: center;
`;

const Google = styled.button`
  ${buttonStyles};
  background-color: #dd4b39;
`;
const Facebook = styled.button`
  ${buttonStyles};
  background-color: #4c69ba;
`;
const Twitter = styled.button`
  ${buttonStyles};
  background-color: #00acee;
`;

const iconStyles = css`
  width: ${rem(20)};
  height: ${rem(20)};
`;

const StyledGoogleIcon = styled(GoogleIcon)`
  ${iconStyles};
`;
const StyledFacebookIcon = styled(FacebookIcon)`
  ${iconStyles};
`;
const StyledTwitterIcon = styled(TwitterIcon)`
  ${iconStyles};
`;

const Text = styled.div`
  font-size: ${rem(18)};
  font-weight: 500;

  margin-left: ${rem(5)};
  position: relative;
  top: ${rem(1)};
`;
