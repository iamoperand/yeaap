import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import styled from '@emotion/styled';
import { isEmpty } from 'lodash';
import Link from 'next/link';

import Layout from '../../components/layout';
import Loading from '../../components/loading';
import rem from '../../utils/rem';

import {
  buttonPrimary,
  buttonRounded,
  buttonCTAPadding,
  buttonWhite,
  buttonDisabled
} from '../../styles/button';
import { box3DBorder } from '../../styles/box';

const GET_USER_AUCTIONS = gql`
  # enum PageOrder {
  #   ASC
  #   DESC
  # }
  #
  # input PageInput {
  #   cursor: String!
  #   order: PageOrder
  # }
  query getUserAuctions($page: PageInput) {
    me {
      id
      auctions(page: $page) {
        edges {
          node {
            id
            description
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

const Auction = ({ auction: { id, description } }) => {
  return (
    <Box>
      <Description>{description}</Description>
      <Link href="/auction/[auctionId]" as={`/auction/${id}`} passHref>
        <LinkButton>Check out</LinkButton>
      </Link>
    </Box>
  );
};
Auction.propTypes = {
  auction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired
};

const Null = () => {
  return <div>Nothing found.</div>;
};

const AuctionList = () => {
  const { loading, error, data, fetchMore } = useQuery(GET_USER_AUCTIONS);
  if (loading) {
    return <Loading />;
  }
  if (error) {
    console.log({ error });
    return <div>Error</div>;
  }

  const {
    me: {
      auctions: { edges, pageInfo }
    }
  } = data;

  const loadMore = () => {
    fetchMore({
      query: GET_USER_AUCTIONS,
      variables: {
        page: {
          cursor: pageInfo.endCursor
        }
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const previousAuctions = previousResult.me.auctions.edges;
        const newAuctions = fetchMoreResult.me.auctions.edges;
        const newPageInfo = fetchMoreResult.me.auctions.pageInfo;

        return {
          ...previousResult,
          me: {
            ...previousResult.me,
            auctions: {
              ...previousResult.me.auctions,
              edges: [...previousAuctions, ...newAuctions],
              pageInfo: newPageInfo
            }
          }
        };
      }
    });
  };

  return (
    <Center>
      <List>
        {!isEmpty(edges) ? (
          edges.map(({ node }) => <Auction key={node.id} auction={node} />)
        ) : (
          <Null />
        )}
      </List>

      <LoadMore disabled={!pageInfo.hasNextPage} onClick={loadMore}>
        Get me more auctions...
      </LoadMore>
    </Center>
  );
};

const Auctions = () => {
  return (
    <Layout>
      <Title>Your Auctions</Title>
      <AuctionList />
    </Layout>
  );
};

export default Auctions;

/*
 ********************************************
 styled components
 ********************************************
 */

const Title = styled.div`
  font-size: ${rem(35)};
  font-weight: 500;
  text-align: center;

  margin-bottom: ${rem(20)};
`;

const List = styled.div`
  text-align: center;

  display: flex;
  flex-wrap: wrap;
`;

const LoadMore = styled.button`
  ${buttonWhite};
  ${buttonRounded};
  ${buttonDisabled};

  margin-top: ${rem(20)};
  font-size: ${rem(20)};
  padding: ${rem(15)} ${rem(20)};
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  flex-direction: column;
`;

const Box = styled.div`
  margin-top: ${rem(10)};
  padding: ${rem(15)};

  color: #fff;
  ${box3DBorder};

  flex: 1 1 ${rem(300)};
  margin: ${rem(10)};
`;

const Description = styled.div`
  font-size: ${rem(22)};
  color: #222;
`;
const LinkButton = styled.button`
  ${buttonPrimary};
  ${buttonRounded};
  ${buttonCTAPadding};
`;
