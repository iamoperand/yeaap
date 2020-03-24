import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import styled from '@emotion/styled';

import BidRow from '../../bid-row';

import rem from '../../../utils/rem';
import theme from '../../../utils/theme';

const showWinning = ({ index, winnerCount, auctionType }) => {
  switch (auctionType) {
    case 'HIGHEST_BID_WINS': {
      return index + 1 <= winnerCount;
    }
    case 'CLOSEST_BID_WINS': {
      return false;
    }
    default:
      return false;
  }
};

const Bids = ({ bids, isUserCreator, winnerCount, auctionType }) => {
  if (isEmpty(bids)) {
    return <div>No bids yet!</div>;
  }

  return (
    <>
      <TableStyles>
        <table>
          <tbody>
            {bids.map((bid, index) => {
              const showWinnerTag = showWinning({
                index,
                winnerCount,
                auctionType
              });
              return (
                <BidRow
                  key={bid.id}
                  bid={bid}
                  index={index}
                  isUserCreator={isUserCreator}
                  showWinnerTag={showWinnerTag}
                  winnerTagLabel="Winning"
                />
              );
            })}
          </tbody>
        </table>
      </TableStyles>
    </>
  );
};

Bids.propTypes = {
  bids: PropTypes.arrayOf(PropTypes.shape),
  isUserCreator: PropTypes.bool.isRequired,
  winnerCount: PropTypes.number.isRequired,
  auctionType: PropTypes.oneOf(['HIGHEST_BID_WINS', 'CLOSEST_BID_WINS'])
};

export default Bids;

/*
 ********************************************
 styled components
 ********************************************
 */

const TableStyles = styled.div`
  table {
    border-collapse: collapse;
    border-right: 20px solid transparent;
    table-layout: fixed;
  }
  margin-top: ${rem(10)};
  max-height: ${rem(365)};
  overflow: overlay;

  td {
    padding: ${rem(4)};
    @media screen and (min-width: ${theme.breakpoints.tablet}) {
      padding: ${rem(4)} ${rem(10)};
    }

    white-space: nowrap;
  }
  td:nth-child(3),
  td:nth-child(4) {
    padding-left: ${rem(10)};
    @media screen and (min-width: ${theme.breakpoints.tablet}) {
      padding-left: ${rem(30)};
    }
  }
`;
