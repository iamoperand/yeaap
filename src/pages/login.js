import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Link from 'next/link';
import { useToasts } from 'react-toast-notifications';
import { isEmpty } from 'lodash';
import Route from 'next/router';

import SimpleLayout from '../components/simple-layout';
import SEO from '../components/seo';
import rem from '../utils/rem';
import { handleSignInError, providerCollection } from '../utils/auth';
import firebase, { auth } from '../utils/firebase';
import redirectWithSSR from '../utils/redirect-with-ssr';

import LoginIcon from '../assets/icons/login.svg?sprite';
import GoogleIcon from '../assets/icons/google.svg?sprite';
import FacebookIcon from '../assets/icons/facebook.svg?sprite';
import TwitterIcon from '../assets/icons/twitter.svg?sprite';

const Login = () => {
  const { addToast } = useToasts();

  const loginHandler = (providerId) => () => {
    const { provider } = providerCollection[providerId];

    auth
      .signInWithPopup(provider)
      .then(() => {
        Route.push('/account');
      })
      .catch((error) => {
        console.log('sorry, there was some issue while signing in!', { error });

        handleSignInError(error).then((message) => {
          if (!isEmpty(message)) {
            addToast(message, {
              appearance: 'error'
            });
          }
        });
      });
  };

  return (
    <SimpleLayout>
      <SEO title="Login" />

      <Wrapper>
        <Link href="/" passHref>
          <Logo>yeaap.co</Logo>
        </Link>

        <Box>
          <div
            css={css`
              width: ${rem(400)};
              margin-right: ${rem(40)};
            `}
          >
            <LoginIcon />
          </div>
          <Buttons>
            <Title>{`Let's log you in!`}</Title>
            <Google
              onClick={loginHandler(
                firebase.auth.GoogleAuthProvider.PROVIDER_ID
              )}
            >
              <GoogleIcon
                css={css`
                  ${iconStyles}
                `}
              />
              <Text>Google</Text>
            </Google>
            <Facebook
              onClick={loginHandler(
                firebase.auth.FacebookAuthProvider.PROVIDER_ID
              )}
            >
              <FacebookIcon
                css={css`
                  ${iconStyles}
                `}
              />
              <Text>Facebook</Text>
            </Facebook>
            <Twitter
              onClick={loginHandler(
                firebase.auth.TwitterAuthProvider.PROVIDER_ID
              )}
            >
              <TwitterIcon
                css={css`
                  ${iconStyles}
                `}
              />
              <Text>Twitter</Text>
            </Twitter>
          </Buttons>
        </Box>
      </Wrapper>
    </SimpleLayout>
  );
};

Login.getInitialProps = ({ req, res }) => {
  const user = req && req.session ? req.session.user : null;
  if (user) {
    redirectWithSSR({ res, path: '/account' });
  }

  return {};
};

export default Login;

/*
 ********************************************
 styled components
 ********************************************
 */

const Wrapper = styled.div`
  margin: ${rem(40)} 0 ${rem(20)};
  text-align: center;
`;

const Logo = styled.a`
  font-size: ${rem(40)};
  font-weight: 500;
  color: #222;
  position: relative;
  display: inline;

  :after {
    content: '';
    width: 100%;
    position: absolute;
    left: 0;
    bottom: -2px;
    border-width: 0 0 4px;
    border-style: solid;
    border-color: #222;
  }
`;

const Box = styled.div`
  margin: 0 auto;
  margin-top: ${rem(100)};
  padding: ${rem(65)} ${rem(50)};
  box-shadow: #3273dc 0 7px 25px 0;
  background-color: #f9f9f9;

  display: flex;
  align-items: center;
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

const Title = styled.div`
  font-size: ${rem(25)};
  font-weight: 500;
  margin-bottom: ${rem(20)};
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${rem(20)} 0;
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
  width: ${rem(25)};
  height: ${rem(25)};
`;

const Text = styled.div`
  font-size: ${rem(20)};
  font-weight: 500;

  margin-left: ${rem(5)};
  position: relative;
  top: ${rem(2)};
`;
