import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Link from 'next/link';
import { useModal } from 'react-modal-hook';

import AuthModal from './modal/auth';

import rem from '../utils/rem';
import BlankCanvasIcon from '../assets/icons/blank-canvas.svg?sprite';
import { buttonWhite, buttonRounded, buttonCTAPadding } from '../styles/button';

const HomeButton = () => (
  <Link href="/">
    <button css={buttonStyles}>Go to home</button>
  </Link>
);

const LoginButton = () => {
  const [showAuthModal, hideAuthModal] = useModal(() => (
    <AuthModal onClose={hideAuthModal} />
  ));

  return (
    <button onClick={showAuthModal} css={buttonStyles}>
      Login
    </button>
  );
};

const NotFound = ({ text = 'Not found.', showLoginButton = false }) => {
  return (
    <Center>
      <BlankCanvasIcon
        css={css`
          width: ${rem(300)};
          height: ${rem(300)};
        `}
      />
      <BigFontDiv>Oops!</BigFontDiv>
      <NormalFontDiv>{text}</NormalFontDiv>

      <CTAWrapper>
        {showLoginButton ? <LoginButton /> : <HomeButton />}
      </CTAWrapper>
    </Center>
  );
};

NotFound.propTypes = {
  text: PropTypes.string,
  showLoginButton: PropTypes.bool
};

export default NotFound;

/*
 ********************************************
 styled components
 ********************************************
 */

const Center = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: ${rem(50)};
`;

const BigFontDiv = styled.div`
  font-size: ${rem(70)};
  text-align: center;
  color: #5a5e64;
  margin-bottom: ${rem(10)};
  font-weight: 500;
`;

const NormalFontDiv = styled.div`
  font-size: ${rem(22)};
  text-align: center;
  color: #6a6e71;
  margin: 0 auto;
  width: ${rem(300)};
`;

const CTAWrapper = styled.div`
  margin: ${rem(40)} auto ${rem(20)};
`;

const buttonStyles = css`
  ${buttonWhite};
  ${buttonRounded};
  ${buttonCTAPadding};
  font-size: ${rem(20)};
`;
