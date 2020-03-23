import React, { useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import gql from 'graphql-tag';
import { useSubscription, useLazyQuery } from '@apollo/react-hooks';
import { uniqBy, first, isEmpty, pick } from 'lodash';
import { useRouter } from 'next/router';
import { differenceInMilliseconds } from 'date-fns';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import BidInfo from '../../components/bid-info';
import { TimeCounter, TopBid, BidCount } from '../../components/bid-stat';
import Leaderboard from '../../components/leaderboard';
import Loading from '../../components/loading';
import AuctionSettling from '../../components/auction-settling';

import rem from '../../utils/rem';
import redirectWithSSR from '../../utils/redirect-with-ssr';
import { difference } from '../../utils/lodash-extended';

import useInterval from '../../hooks/use-interval';

const GET_AUCTION = gql`
  # type AuctionWhereInput {
  #   auctionId: String!
  # }
  query($where: AuctionWhereInput!) {
    auctions(where: $where) {
      edges {
        node {
          id
          creatorId
          creator {
            id
            name
          }

          description
          bidCount
          endsAt
          type
          hasBidsVisible
          isCanceled
          isSettled
          winnerCount
        }
      }
    }
  }
`;

const GET_AUCTION_BID_COUNT = gql`
  query($where: AuctionWhereInput!) {
    auctions(where: $where) {
      edges {
        node {
          id
          bidCount
        }
      }
    }
  }
`;

const ON_BIDS_CREATED = gql`
  subscription onBidsCreated($where: AuctionWhereInput!) {
    onBidsCreated(where: $where) {
      id
      amount
      message
      creator {
        name
        photoUrl
      }
      createdAt
    }
  }
`;

const ON_AUCTION_UPDATED = gql`
  subscription onAuctionUpdated($where: AuctionWhereInput!) {
    onAuctionUpdated(where: $where) {
      id
      description
      endsAt
      isCanceled
      isSettled
    }
  }
`;

const actions = {
  BIDS_CREATED: 'BIDS_CREATED',
  AUCTION_CHANGED: 'AUCTION_CHANGED'
};

const modifiableAuctionProps = [
  'description',
  'endsAt',
  'bidCount',
  'isCanceled',
  'isSettled'
];

const reducer = (state, action) => {
  switch (action.type) {
    case actions.BIDS_CREATED: {
      const newBids = action.payload;
      if (isEmpty(newBids)) {
        return state;
      }

      const uniqueBids = uniqBy([...newBids, ...state.bids], (bid) => bid.id);
      return {
        ...state,
        bids: uniqueBids
      };
    }
    case actions.AUCTION_CHANGED: {
      const newAuction = pick(action.payload, modifiableAuctionProps);
      if (isEmpty(newAuction)) {
        return state;
      }

      const diff = difference(newAuction, pick(state, modifiableAuctionProps));
      if (isEmpty(diff)) {
        return state;
      }
      return {
        ...state,
        ...diff
      };
    }
    default:
      return state;
  }
};

const getTimeLeftInMs = (endsAt) =>
  differenceInMilliseconds(new Date(endsAt), new Date());

const lessThanOrEqual = (input, value) => input === value || input < value;

// eslint-disable-next-line max-lines-per-function
const AuctionView = ({ auction }) => {
  const [state, dispatch] = useReducer(reducer, {
    ...pick(auction, modifiableAuctionProps),
    bids: []
  });

  const [getAuction] = useLazyQuery(GET_AUCTION_BID_COUNT, {
    variables: {
      where: {
        auctionId: auction.id
      }
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      dispatch({
        type: actions.AUCTION_CHANGED,
        payload: data.auctions.edges[0].node
      });
    }
  });

  const { loading: bidsLoading } = useSubscription(ON_BIDS_CREATED, {
    variables: {
      where: {
        auctionId: auction.id
      }
    },
    onSubscriptionData: ({
      subscriptionData: {
        data: { onBidsCreated = [] }
      }
    }) => {
      dispatch({ type: actions.BIDS_CREATED, payload: onBidsCreated });

      // refetch bidCount whenever a new bid gets created
      getAuction();
    }
  });

  useSubscription(ON_AUCTION_UPDATED, {
    variables: {
      where: {
        auctionId: auction.id
      }
    },
    onSubscriptionData: ({
      subscriptionData: {
        data: { onAuctionUpdated }
      }
    }) => dispatch({ type: actions.AUCTION_CHANGED, payload: onAuctionUpdated })
  });

  const { description, bidCount, endsAt, bids, isCanceled, isSettled } = state;

  const [topBid, setTopBid] = useState(0);
  useEffect(() => {
    setTopBid(isEmpty(bids) ? 0 : first(bids).amount);
  }, [bids]);

  const router = useRouter();
  useEffect(() => {
    if (isCanceled) {
      router.replace({
        pathname: `${router.asPath}/cancelled`
      });
      return;
    }
    if (isSettled) {
      router.replace({
        pathname: `${router.asPath}/ended`
      });
    }
  }, [isCanceled, isSettled, router]);

  const [timeLeftInMs, setTimeLeftInMs] = useState(getTimeLeftInMs(endsAt));

  const [isSettling, setSettling] = useState(false);

  useInterval(() => {
    const timeLeftFromNow = getTimeLeftInMs(endsAt);
    setTimeLeftInMs(timeLeftFromNow);

    if (lessThanOrEqual(timeLeftFromNow, 0) && !isSettled && !isSettling) {
      setSettling(true);
    }
  }, 1000);

  if (isSettling) {
    return <AuctionSettling />;
  }

  return (
    <Layout>
      <SEO title="Auction" />

      <BidInfo
        creatorId={auction.creatorId}
        name={auction.creator.name}
        description={description}
        endsAt={endsAt}
        isLeaderboardLoading={bidsLoading}
        auctionId={auction.id}
        auctionType={auction.type}
        hasBidsVisible={auction.hasBidsVisible}
        topBid={topBid}
      />

      <BidStatsWrapper>
        <TimeCounter timeLeftInMs={timeLeftInMs} />
        <TopBid value={topBid} />
        <BidCount value={bidCount} />
      </BidStatsWrapper>

      {auction.hasBidsVisible && (
        <LeaderboardWrapper>
          {bidsLoading ? (
            <Loading />
          ) : (
            <Leaderboard
              bids={bids}
              creatorId={auction.creatorId}
              winnerCount={auction.winnerCount}
              auctionType={auction.type}
            />
          )}
        </LeaderboardWrapper>
      )}
    </Layout>
  );
};

AuctionView.getInitialProps = async ({ query, apolloClient, res }) => {
  const { auctionId } = query;

  const { data } = await apolloClient.query({
    query: GET_AUCTION,
    variables: {
      where: {
        auctionId
      }
    }
  });

  const auction = data.auctions.edges[0].node;
  if (auction.isCanceled) {
    redirectWithSSR({ res, path: `/auction/${auctionId}/cancelled` });
    return {};
  }
  if (auction.isSettled) {
    redirectWithSSR({ res, path: `/auction/${auctionId}/ended` });
    return {};
  }

  return { auction };
};

AuctionView.propTypes = {
  auction: PropTypes.shape().isRequired
};

export default AuctionView;

/*
 ********************************************
 styled components
 ********************************************
 */

const rowSpacingStyles = css`
  margin-top: ${rem(80)};
`;

const BidStatsWrapper = styled.div`
  display: grid;
  grid-template-areas: 'timeLeft topBid BidCount';
  grid-template-columns: ${rem(200)} 1fr ${rem(200)};
  grid-column-gap: ${rem(25)};

  ${rowSpacingStyles};
`;

const LeaderboardWrapper = styled.div`
  ${rowSpacingStyles};
`;
