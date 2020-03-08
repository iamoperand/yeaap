import React from 'react';
import NextApp from 'next/app';
import { css, Global } from '@emotion/core';
import ReactModal from 'react-modal';
import withApollo from 'next-with-apollo';
import { ApolloProvider } from '@apollo/react-hooks';

import theme from '../utils/theme';
import { initApollo } from '../utils/apollo-client';
import normalizeStyles from '../styles/normalize';
import fonts from '../styles/fonts';
import AppProviders from '../context';

class App extends NextApp {
  componentDidMount() {
    if (process.browser) {
      // for accessibility, to let screenreaders know that the other page content will be hidden, when the modal is open!
      ReactModal.setAppElement('body');
    }
  }
  render() {
    const { Component, pageProps, apollo } = this.props;
    return (
      <ApolloProvider client={apollo}>
        <Global styles={globalStyles} />
        <AppProviders>
          <Component {...pageProps} />
        </AppProviders>
      </ApolloProvider>
    );
  }
}

App.getInitialProps = async (appContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return { ...appProps };
};

export default withApollo(initApollo)(App);

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

  small {
    font-size: 14px;
  }

  ul,
  ol {
    list-style-type: none;
  }

  /* google maps autocomplete */
  .pac-container {
    font-size: 16px;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'DIN Next LT Pro';

    /* adjust the position of the dropdown */
    margin-left: 3px;

    .pac-item {
      cursor: pointer;
      padding: 2px 5px;
    }
  }
`;
