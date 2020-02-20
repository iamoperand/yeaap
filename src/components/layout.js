import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import rem from '../utils/rem';
import theme from '../utils/theme';
import Footer from '../components/footer';
import Header from '../components/header';

const Layout = ({ children }) => {
  return (
    <Body>
      <Center>
        <Header />
        <Content>{children}</Content>
        <Footer />
      </Center>
    </Body>
  );
};

Layout.propTypes = {
  children: PropTypes.node
};

export default Layout;

/*
 ********************************************
 styled components
 ********************************************
 */

const Body = styled.div`
  width: 100%;
  height: 100%;
`;

const Center = styled.div`
  max-width: ${rem(700)};
  width: calc(100% - ${rem(30)});
  margin: 0 auto;

  @media (min-width: ${theme.breakpoints.xs}) {
    width: calc(100% - ${rem(350)});
  }

  min-height: 100vh;

  display: grid;
  grid-template-areas:
    'header'
    'content'
    'footer';

  grid-template-rows: ${rem(70)} 1fr ${rem(100)};
  grid-row-gap: ${rem(30)};
`;

const Content = styled.div`
  grid-area: content;
`;
