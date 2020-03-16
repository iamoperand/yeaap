import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import Layout from '../../../components/layout';
import SEO from '../../../components/seo';
import AuctionResults from '../../../components/auction-results';

import redirectWithSSR from '../../../utils/redirect-with-ssr';

const GET_AUCTION = gql`
  query getAuction($where: AuctionWhereInput!) {
    auctions(where: $where) {
      edges {
        node {
          id
          creatorId
          creator {
            id
            name
            photoUrl
          }

          description
          endsAt
          type
          hasBidsVisible
          isCanceled
          isSettled
          winnerCount
          bidCount
        }
      }
    }
  }
`;

const Results = ({ auction }) => {
  return (
    <Layout>
      <SEO title="Auction results" />
      <AuctionResults
        auctionId={auction.id}
        creatorId={auction.creatorId}
        bidCount={auction.bidCount}
      />
    </Layout>
  );
};

Results.getInitialProps = async ({ query, apolloClient, res }) => {
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
  if (!auction.isSettled) {
    redirectWithSSR({ res, path: `/auction/${auctionId}` });
    return {};
  }

  return { auction };
};

Results.propTypes = {
  auction: PropTypes.shape().isRequired
};

export default Results;
