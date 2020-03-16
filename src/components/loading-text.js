import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import { capitalize } from 'lodash';

const LoadingText = ({ text = 'loading' }) => {
  return <Text>{capitalize(text)}</Text>;
};

LoadingText.propTypes = {
  text: PropTypes.string
};

export default LoadingText;

/*
 ********************************************
 styled components
 ********************************************
 */

const dotsAnimation = keyframes`
  0%, 20% {
    color: rgba(0,0,0,0);
    text-shadow:
      .25em 0 0 rgba(0,0,0,0),
      .5em 0 0 rgba(0,0,0,0);
  }
  40% {
    color: white;
    text-shadow:
      .25em 0 0 rgba(0,0,0,0),
      .5em 0 0 rgba(0,0,0,0);
  }
  60% {
    text-shadow:
      .25em 0 0 white,
      .5em 0 0 rgba(0,0,0,0);
  }
  80%, 100% {
    text-shadow:
      .25em 0 0 white,
      .5em 0 0 white;
  }
`;

const Text = styled.div`
  position: relative;
  left: -3px;
  :after {
    content: '.';
    animation: ${dotsAnimation} 1s steps(5, end) infinite;
  }
`;
