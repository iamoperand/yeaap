import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import styled from '@emotion/styled';
import { get, slice, uniqBy } from 'lodash';
import { useToasts } from 'react-toast-notifications';

import Loading from './loading';
import BidRow from './bid-row';
import Pagination from './pagination';

import rem from '../utils/rem';
import { getErrorMessage } from '../utils/error';
import theme from '../utils/theme';

import { boxBorder } from '../styles/box';

import useSession from '../hooks/use-session';
import useDeviceBreakpoint from '../hooks/use-device-breakpoint';

const GET_AUCTION_BIDS = gql`
  query getBids($where: AuctionWhereInput!, $page: PageInput) {
    bids(where: $where, page: $page) {
      edges {
        node {
          id
          creator {
            id
            name
            photoUrl
          }
          amount
          isWinner
          message
          createdAt
        }
      }

      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const mapBidEdges = (edges) =>
  edges.map(({ node }, index) => ({
    ...node,
    index
  }));

// eslint-disable-next-line max-lines-per-function
const AuctionResults = ({ auctionId, creatorId, bidCount }) => {
  const { user } = useSession();
  const { addToast } = useToasts();

  const [page, setPage] = useState(0);
  const [visibleBids, setVisibleBids] = useState([]);
  const itemsAllowedPerPage = 10;

  const { data, loading, fetchMore } = useQuery(GET_AUCTION_BIDS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      where: {
        auctionId
      },
      page: {
        limit: itemsAllowedPerPage
      }
    },
    onCompleted: ({ bids: { edges } }) => {
      const allBids = mapBidEdges(edges);

      const startingIndex = page * itemsAllowedPerPage;
      setVisibleBids(
        slice(allBids, startingIndex, startingIndex + itemsAllowedPerPage)
      );
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(
        error,
        'An error occurred while fetching the bids'
      );
      addToast(errorMessage, {
        appearance: 'error'
      });
    }
  });

  const edges = get(data, 'bids.edges', []);
  const pageInfo = get(data, 'bids.pageInfo', {});

  const loadMore = () => {
    fetchMore({
      query: GET_AUCTION_BIDS,
      variables: {
        where: {
          auctionId
        },
        page: {
          cursor: pageInfo.endCursor,
          limit: itemsAllowedPerPage
        }
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const existingBids = previousResult.bids.edges;
        const newBids = fetchMoreResult.bids.edges;
        const newPageInfo = fetchMoreResult.bids.pageInfo;

        return {
          bids: {
            ...previousResult.bids,
            edges: uniqBy([...existingBids, ...newBids], ({ node }) => node.id),
            pageInfo: newPageInfo
          }
        };
      }
    });
  };

  const isUserCreator = get(user, 'id') === creatorId;

  const handleNextPageClick = () => {
    setPage((currentPage) => currentPage + 1);
    loadMore();
  };
  const handlePrevPageClick = () => {
    const allBids = mapBidEdges(edges);

    const newPage = page - 1;
    const startingIndex = newPage * itemsAllowedPerPage;

    setPage(page - 1);
    setVisibleBids(
      slice(allBids, startingIndex, startingIndex + itemsAllowedPerPage)
    );
  };

  const totalPages = Math.floor(bidCount / itemsAllowedPerPage);

  const { breakpoint } = useDeviceBreakpoint();

  return (
    <Wrapper>
      <Pagination
        onNext={handleNextPageClick}
        onPrev={handlePrevPageClick}
        currentPage={page}
        totalPages={totalPages}
        isFetchingData={loading}
      />
      <LeaderboardWrapper>
        {loading ? (
          <Loading />
        ) : (
          <TableWrapper>
            <TableContentStyles>
              <table align="center">
                {breakpoint === 'mobile' ? null : (
                  <thead>
                    <tr className="no-hover">
                      <th></th>
                      <th>Bid</th>
                      <th>User</th>
                      <th></th>
                    </tr>
                  </thead>
                )}
                <tbody>
                  {visibleBids.map((bid) => (
                    <BidRow
                      key={bid.id}
                      bid={bid}
                      index={bid.index}
                      isUserCreator={isUserCreator}
                      showWinnerTag={bid.isWinner}
                      size="large"
                    />
                  ))}
                </tbody>
              </table>
            </TableContentStyles>
          </TableWrapper>
        )}
      </LeaderboardWrapper>
    </Wrapper>
  );
};

AuctionResults.propTypes = {
  auctionId: PropTypes.string.isRequired,
  creatorId: PropTypes.string.isRequired,
  bidCount: PropTypes.number.isRequired
};

export default AuctionResults;

/*
 ********************************************
 styled components
 ********************************************
 */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LeaderboardWrapper = styled.div`
  margin: 0 auto;

  min-height: 280px;
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    min-height: 550px;
  }

  display: flex;
  justify-content: center;
  width: 100%;
`;

const TableWrapper = styled.div`
  padding: ${rem(10)};
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    padding: ${rem(10)} ${rem(30)} ${rem(20)};
  }
  width: 100%;
  border-radius: 10px;

  ${boxBorder};
  border-top: none;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
`;

const TableContentStyles = styled.div`
  table {
    border-collapse: collapse;
    border-right: 20px solid transparent;
    border-bottom: 20px solid transparent;
    table-layout: fixed;
  }
  overflow: overlay;

  thead th {
    color: #788896;
    font-size: ${rem(18)};
    font-weight: normal;
    text-align: left;
    padding-bottom: ${rem(20)};
  }

  margin-top: ${rem(10)};

  th,
  td {
    padding: ${rem(4)};
    @media screen and (min-width: ${theme.breakpoints.tablet}) {
      padding: ${rem(4)} ${rem(10)};
    }
  }

  th:nth-child(2),
  td:nth-child(2) {
    padding-right: ${rem(5)};
    @media screen and (min-width: ${theme.breakpoints.tablet}) {
      padding-right: ${rem(100)};
    }
  }

  th:nth-child(3),
  td:nth-child(3),
  th:nth-child(4),
  td:nth-child(4) {
    padding-left: ${rem(10)};
    @media screen and (min-width: ${theme.breakpoints.tablet}) {
      padding-left: ${rem(30)};
    }
  }

  tr:hover {
    background-color: #e3e8ee;
  }
  tr.no-hover:hover {
    background: none;
  }
`;
