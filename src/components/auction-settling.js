import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';

import rem from '../utils/rem';

import Layout from './layout';
import SEO from './seo';

const AuctionSettling = () => (
  <Layout>
    <SEO title="Auction Settling..." />

    <Wrapper>
      <Img src="/images/time-up.gif" />
      <BigFont>{"Time's up!"}</BigFont>
      <NormalFont>Auction has ended.</NormalFont>

      <Loading>Please wait</Loading>
      <SmallFont>as we find out the winner/s.</SmallFont>
    </Wrapper>
  </Layout>
);

export default AuctionSettling;

/*
 ********************************************
 styled components
 ********************************************
 */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-top: ${rem(50)};
`;

const Img = styled.img`
  width: ${rem(200)};
  height: ${rem(200)};
`;

const BigFont = styled.div`
  font-size: ${rem(70)};
  text-align: center;
  color: #5a5e64;
  font-weight: 500;
  margin: ${rem(30)} 0 0;
`;

const NormalFont = styled.div`
  font-size: ${rem(22)};
  text-align: center;
  color: #6a6e71;
  margin: 0 auto;
  width: ${rem(300)};
`;

const SmallFont = styled.div`
  font-size: ${rem(18)};
  text-align: center;
  color: #6a6e71;
  margin: 0 auto;
  width: ${rem(300)};
`;

const dotsAnimation = keyframes`
  0%, 20% {
    color: rgba(0,0,0,0);
    text-shadow:
      .25em 0 0 rgba(0,0,0,0),
      .5em 0 0 rgba(0,0,0,0);
  }
  40% {
    color: #6a6e71;
    text-shadow:
      .25em 0 0 rgba(0,0,0,0),
      .5em 0 0 rgba(0,0,0,0);
  }
  60% {
    text-shadow:
      .25em 0 0 #6a6e71,
      .5em 0 0 rgba(0,0,0,0);
  }
  80%, 100% {
    text-shadow:
      .25em 0 0 #6a6e71,
      .5em 0 0 #6a6e71;
  }
`;

const Loading = styled.div`
  margin: ${rem(100)} auto 0;
  font-size: ${rem(30)};
  font-weight: 500;
  text-align: center;
  color: #6a6e71;
  position: relative;
  left: -${rem(5)};

  :after {
    content: '.';
    animation: ${dotsAnimation} 1s steps(5, end) infinite;
  }
`;
