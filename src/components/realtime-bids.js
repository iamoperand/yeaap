import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import styled from '@emotion/styled';
import { uniqBy } from 'lodash';

import Leaderboard from '../components/leaderboard-main';
import Loading from '../components/loading';
import rem from '../utils/rem';
import theme from '../utils/theme';

const ON_BIDS_CREATED = gql`
  subscription onBidsCreated($where: AuctionWhereInput!) {
    onBidsCreated(where: $where) {
      id
      amount
      isWinner
      message
      creator {
        id
        name
        photoUrl
      }
    }
  }
`;

const RealtimeBids = ({ auctionId, winnerCount }) => {
  const [bids, setBids] = useState([]);

  const { loading } = useSubscription(ON_BIDS_CREATED, {
    variables: {
      where: {
        auctionId
      }
    },
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      const newBids = data && data.onBidsCreated ? data.onBidsCreated : [];
      const uniqueBids = uniqBy([...newBids, ...bids], (bid) => bid.id);
      setBids(uniqueBids);
    }
  });
  if (loading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <Title>The Leaderboard</Title>
      <Leaderboard bids={bids} winnerCount={winnerCount} />
    </Wrapper>
  );
};

RealtimeBids.propTypes = {
  auctionId: PropTypes.string.isRequired,
  winnerCount: PropTypes.number.isRequired
};

export default RealtimeBids;

/*
 ********************************************
 styled components
 ********************************************
 */

const Title = styled.div`
  font-size: ${rem(30)};
  font-weight: 500;
  color: ${theme.colors.links};
  text-align: center;

  margin: ${rem(15)} 0 ${rem(25)};
`;

const Wrapper = styled.div`
  text-align: center;
  padding: ${rem(10)};
  width: 90%;
  margin: 0 auto;

  min-height: 100%;
`;
