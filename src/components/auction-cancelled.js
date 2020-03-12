import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import rem from '../utils/rem';

import Layout from './layout';
import SEO from './seo';

import BlankCanvasIcon from '../assets/icons/blank-canvas.svg?sprite';

const AuctionCancelled = () => {
  return (
    <Layout>
      <SEO title="Auction cancelled" />
      <Center>
        <BlankCanvasIcon
          css={css`
            width: ${rem(300)};
            height: ${rem(300)};
          `}
        />
        <BigFontDiv>Oops!</BigFontDiv>
        <NormalFontDiv>
          This auction has been cancelled by the owner.
        </NormalFontDiv>
      </Center>
    </Layout>
  );
};

export default AuctionCancelled;

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
