import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { isEmpty } from 'lodash';
import { useToasts } from 'react-toast-notifications';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import Loading from '../../components/loading';
import AuctionList from '../../components/auction-list';
import NotFound from '../../components/not-found';

import theme from '../../utils/theme';
import rem from '../../utils/rem';
import { getErrorMessage } from '../../utils/error';
import useSession from '../../hooks/use-session';

import ChevronsRightIcon from '../../assets/icons/chevrons-right.svg?sprite';

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

  if (isEmpty(auctionConnection.edges)) {
    return <NullWarning>{"You don't have any auctions to show."}</NullWarning>;
  }

  return <AuctionList auctionConnection={auctionConnection} />;
};

const AuctionsPage = () => {
  const { user, isUserLoading } = useSession();

  if (isUserLoading) {
    return <Loading />;
  }
  if (!user) {
    return (
      <Layout>
        <SEO title="Your bids" />
        <NotFound text="User not found." showLoginButton={true} />
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Your auctions" />

      <Title>
        <ChevronsRightIcon
          css={css`
            width: ${rem(35)};
            height: ${rem(35)};
            position: relative;
            top: -2.5px;
          `}
        />
        Your last 20 auctions
      </Title>

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

const Title = styled.div`
  color: ${theme.colors.links};
  font-size: ${rem(32)};
  font-weight: 500;
  margin-bottom: ${rem(30)};
  display: flex;
  align-items: center;
  position: relative;
  left: -10px;
`;

const NullWarning = styled.div`
  margin-top: ${rem(10)};
  color: #303f4b;
  font-size: ${rem(18)};
`;
