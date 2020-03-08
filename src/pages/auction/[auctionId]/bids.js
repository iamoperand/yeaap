import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import Layout from '../../../components/layout';
import SEO from '../../../components/seo';
import RealtimeBids from '../../../components/realtime-bids';

const GET_AUCTION = gql`
  # type AuctionWhereInput {
  #   auctionId: String!
  # }
  query getAuction($where: AuctionWhereInput!) {
    auctions(where: $where) {
      edges {
        node {
          id
          creatorId
          creator {
            name
          }

          description
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

const Bids = ({ auction }) => {
  return (
    <Layout>
      <SEO title="View bids" />
      <RealtimeBids auctionId={auction.id} winnerCount={auction.winnerCount} />
    </Layout>
  );
};

Bids.getInitialProps = async ({ query, apolloClient }) => {
  const { auctionId } = query;

  const { data } = await apolloClient.query({
    query: GET_AUCTION,
    variables: {
      where: {
        auctionId
      }
    }
  });

  return {
    auction: data.auctions.edges[0].node
  };
};

Bids.propTypes = {
  auction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    winnerCount: PropTypes.number.isRequired
  }).isRequired
};

export default Bids;
