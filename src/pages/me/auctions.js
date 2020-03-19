import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import styled from '@emotion/styled';
import { isEmpty } from 'lodash';

import { useToasts } from 'react-toast-notifications';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import Loading from '../../components/loading';
import AuctionList from '../../components/auction-list';

import theme from '../../utils/theme';
import rem from '../../utils/rem';
import { getErrorMessage } from '../../utils/error';

const GET_USER_AUCTIONS = gql`
  query getUserAuctions($page: PageInput) {
    me {
      id
      auctions(page: $page) {
        edges {
          node {
            id
            description
            isCanceled
            isSettled
            endsAt
            type
            hasBidsVisible
          }
        }

        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

const Auctions = () => {
  const { addToast } = useToasts();
  const { loading, data } = useQuery(GET_USER_AUCTIONS, {
    onError: (error) => {
      const errorMessage = getErrorMessage(error, "Couldn't get user auctions");
      addToast(errorMessage, {
        appearance: 'error'
      });
    }
  });

  if (loading) {
    return <Loading />;
  }

  const {
    me: { auctions: auctionConnection }
  } = data;

  if (isEmpty(auctionConnection)) {
    return <NullWarning>{"You don't have any auctions to show."}</NullWarning>;
  }

  return <AuctionList auctionConnection={auctionConnection} />;
};

const AuctionsPage = () => {
  return (
    <Layout>
      <SEO title="Your auctions" />
      <TitleWrapper>
        <Title>Last 20 auctions</Title>
      </TitleWrapper>

      <Auctions />
    </Layout>
  );
};

export default AuctionsPage;

/*
 ********************************************
 styled components
 ********************************************
 */

const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Title = styled.div`
  color: ${theme.colors.links};
  font-size: ${rem(30)};
  font-weight: 500;
  margin-bottom: ${rem(20)};

  position: relative;
  :after {
    content: '';
    width: 100%;
    position: absolute;
    left: 0;
    bottom: -1px;
    border-width: 0 0 2px;
    border-style: solid;
    border-color: #aba5ff;
  }
`;

const NullWarning = styled.div`
  margin-top: ${rem(10)};
  color: #303f4b;
  font-size: ${rem(18)};
`;
