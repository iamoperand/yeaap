import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import BidInfo from '../../components/bid-info';
import BidStat from '../../components/bid-stat';
import Leaderboard from '../../components/leaderboard';

import rem from '../../utils/rem';

const BidView = () => {
  const timeLeft = '01:20';

  const topBid = 127;
  const bidCount = 31;

  const leaderboardData = [
    {
      avatar: '',
      name: 'Eniz Vukovic',
      username: 'mannol',
      bid: 39
    },
    {
      avatar: '',
      name: 'Nikhil Arora',
      username: 'iamoperand',
      bid: 25
    },
    {
      avatar: '',
      name: 'Michael Jackson',
      username: 'michael',
      bid: 15
    },
    {
      avatar: '',
      name: 'Undertaker',
      username: 'undertaker',
      bid: 10
    }
  ];

  return (
    <Layout>
      <SEO />

      <BidInfo
        name="Eniz Vukovic"
        description="Whoever bids the most, gets to play a game with me!"
      />

      <BidStatsWrapper>
        <BidStat label="Time left:" value={timeLeft} type="time" />
        <BidStat label="Top bid:" value={topBid} type="currency" />
        <BidStat label="Bid count:" value={bidCount} type="count" />
      </BidStatsWrapper>

      <LeaderboardWrapper>
        <Leaderboard bidId="1" data={leaderboardData} />
      </LeaderboardWrapper>
    </Layout>
  );
};

export default BidView;

/*
 ********************************************
 styled components
 ********************************************
 */

const rowSpacingStyles = css`
  margin-top: ${rem(70)};
`;

const BidStatsWrapper = styled.div`
  display: grid;
  grid-template-areas: 'timeLeft topBid BidCount';
  grid-template-columns: 1fr 2fr 1fr;
  grid-column-gap: ${rem(15)};

  ${rowSpacingStyles};
`;

const LeaderboardWrapper = styled.div`
  ${rowSpacingStyles};
`;
