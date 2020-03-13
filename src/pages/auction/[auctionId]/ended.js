import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from 'next/link';
import gql from 'graphql-tag';

import rem from '../../../utils/rem';
import redirectWithSSR from '../../../utils/redirect-with-ssr';

import Layout from '../../../components/layout';
import SEO from '../../../components/seo';

import {
  buttonWhite,
  buttonRounded,
  buttonCTAPadding
} from '../../../styles/button';

const GET_AUCTION = gql`
  query($where: AuctionWhereInput!) {
    auctions(where: $where) {
      edges {
        node {
          id
          isSettled
        }
      }
    }
  }
`;

const Results = ({ auction }) => (
  <Layout>
    <SEO title="Auction cancelled" />

    <Wrapper>
      <Img src="/images/time-up.gif" />
      <BigFont>{"Time's up!"}</BigFont>
      <NormalFont>Auction has ended.</NormalFont>

      <Link href="/auction/[auctionId]/bids" as={`/auction/${auction.id}/bids`}>
        <AnchorButton>Checkout results</AnchorButton>
      </Link>
    </Wrapper>
  </Layout>
);

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
  if (!auction.isSettled) {
    redirectWithSSR({ res, path: `/auction/${auctionId}` });
  }

  return { auction };
};

Results.propTypes = {
  auction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isSettled: PropTypes.bool.isRequired
  }).isRequired
};

export default Results;

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

const AnchorButton = styled.button`
  margin: ${rem(100)} auto ${rem(20)};

  ${buttonWhite};
  ${buttonRounded};
  ${buttonCTAPadding};
  font-size: ${rem(20)};
`;
