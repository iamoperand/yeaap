import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import rem from '../utils/rem';
import Footer from '../components/footer';
import Header from '../components/header';
import { bodyStyles, centerStyles } from '../styles/layout';

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
  ${bodyStyles};
`;

const Center = styled.div`
  ${centerStyles};

  display: grid;
  grid-template-areas:
    'header'
    'content'
    'footer';
  grid-template-rows: ${rem(70)} 1fr ${rem(100)};
  grid-template-columns: 100%;
  grid-row-gap: ${rem(30)};
`;

const Content = styled.div`
  grid-area: content;
  padding: ${rem(30)} 0;
`;
