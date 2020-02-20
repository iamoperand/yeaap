import React from 'react';
import NextApp from 'next/app';
import { css, Global } from '@emotion/core';
import ReactModal from 'react-modal';

import theme from '../utils/theme';
import normalizeStyles from '../styles/normalize';
import fonts from '../styles/fonts';
import AppProviders from '../context';

import '../utils/firebase';

export default class App extends NextApp {
  componentDidMount() {
    if (process.browser) {
      // for accessibility, to let screenreaders know that the other page content will be hidden, when the modal is open!
      ReactModal.setAppElement('body');
    }
  }
  render() {
    const { Component, pageProps } = this.props;
    return (
      <AppProviders>
        <Global styles={globalStyles} />
        <Component {...pageProps} />
      </AppProviders>
    );
  }
}

/*
 ********************************************
 styled components
 ********************************************
 */

const globalStyles = css`
  ${normalizeStyles};
  ${fonts};

  html,
  body {
    margin: 0;
    height: 100%;
    font-size: 16px;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    font-family: 'DIN Next LT Pro';
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  textarea {
    resize: none;
  }
  input,
  textarea,
  select {
    border: 2px solid rgba(120, 129, 136, 0.5);
    border-radius: 4px;
    padding: 8px;
  }

  button {
    border: none;
    outline: none;
    cursor: pointer;
  }

  a {
    color: ${theme.colors.links};
    text-decoration: none;
    position: relative;
    cursor: pointer;

    :after {
      content: '';
      width: 100%;
      position: absolute;
      left: 0;
      bottom: -1px;
      border-width: 0 0 2px;
      border-style: solid;
      border-color: #c7c3fb;
    }
  }
`;
