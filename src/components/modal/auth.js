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
  modalOverlay
} from '../../styles/modal';
import { labelBasic } from '../../styles/form';

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

  min-width: 0;
  width: ${rem(320)};
  padding: ${rem(40)};
`;

const Title = styled.div`
  ${labelBasic};
  display: block;
  font-size: ${rem(22)};
`;

const buttonStyles = css`
  color: #fff;
  background-color: transparent;
  border-radius: 3px;
  box-sizing: border-box;
  position: relative;
  top: -2px;
  left: -2px;
  transition: transform 0.2s;
  z-index: 0;

  :before {
    content: '';
    background: #fff;
    border: 3px solid #313131;
    border-radius: 3px;
    position: absolute;
    top: -2px;
    left: -2px;
    height: 100%;
    width: 100%;
    z-index: -1;
  }

  :after {
    content: '';
    display: block;
    background: #ccc;
    border: 3px solid #313131;
    border-radius: 3px;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 2px;
    left: 2px;
    right: 0;
    z-index: -2;
    transition: transform 0.2s;
  }

  :focus:after,
  :hover:after {
    transform: translate(-1px, -1.5px);
  }
  :focus,
  :hover {
    transform: translate(1px, 1px);
  }

  padding: ${rem(15)} ${rem(40)};
  margin: ${rem(10)} 0;
  min-width: ${rem(220)};

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
  ::before {
    background-color: #dd4b39;
  }
`;
const Facebook = styled.button`
  ${buttonStyles};
  ::before {
    background-color: #4c69ba;
  }
`;
const Twitter = styled.button`
  ${buttonStyles};
  ::before {
    background-color: #00acee;
  }
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
