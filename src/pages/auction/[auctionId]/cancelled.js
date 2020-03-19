import React from 'react';
import gql from 'graphql-tag';

import redirectWithSSR from '../../../utils/redirect-with-ssr';

import Layout from '../../../components/layout';
import SEO from '../../../components/seo';
import NotFound from '../../../components/not-found';

const GET_AUCTION = gql`
  query($where: AuctionWhereInput!) {
    auctions(where: $where) {
      edges {
        node {
          id
          isCanceled
        }
      }
    }
  }
`;

const Cancelled = () => {
  return (
    <Layout>
      <SEO title="Auction cancelled" />
      <NotFound text="This auction has been cancelled by the owner." />
    </Layout>
  );
};
Cancelled.getInitialProps = async ({ query, apolloClient, res }) => {
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
  if (!auction.isCanceled) {
    redirectWithSSR({ res, path: `/auction/${auctionId}` });
  }

  return {};
};

export default Cancelled;
