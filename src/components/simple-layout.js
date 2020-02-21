import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import rem from '../utils/rem';
import Footer from '../components/footer';
import { bodyStyles, centerStyles } from '../styles/layout';

const SimpleLayout = ({ children }) => {
  return (
    <Body>
      <Center>
        <Content>{children}</Content>
        <Footer />
      </Center>
    </Body>
  );
};

SimpleLayout.propTypes = {
  children: PropTypes.node
};

export default SimpleLayout;

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
    'content'
    'footer';
  grid-template-rows: 1fr ${rem(100)};
  grid-row-gap: ${rem(30)};
`;

const Content = styled.div`
  grid-area: content;
`;
