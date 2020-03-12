import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import styled from '@emotion/styled';

import Bid from './bid';

import rem from '../../../utils/rem';

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
      <TableHeaderStyles>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Bid</th>
              <th>User</th>
              <th></th>
            </tr>
          </thead>
        </table>
      </TableHeaderStyles>

      <TableContentStyles>
        <table>
          <tbody>
            {bids.map((bid, index) => (
              <Bid
                key={bid.id}
                bid={bid}
                index={index}
                isUserCreator={isUserCreator}
                isWinning={showWinning({ index, winnerCount, auctionType })}
              />
            ))}
          </tbody>
        </table>
      </TableContentStyles>
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

const TableHeaderStyles = styled.div`
  thead th {
    color: #788896;
    font-size: ${rem(18)};
    font-weight: normal;
    padding: ${rem(4)} ${rem(10)};
    white-space: nowrap;
    text-align: left;
  }

  th:nth-child(1) {
    width: ${rem(50)};
  }
  th:nth-child(2) {
    width: ${rem(200)};
  }
  th:nth-child(3) {
    padding-left: ${rem(25)};
  }
`;

const TableContentStyles = styled.div`
  table {
    border-collapse: collapse;
    border-right: 20px solid transparent;
    table-layout: fixed;
  }
  margin-top: ${rem(10)};
  max-height: ${rem(365)};
  overflow: overlay;

  td {
    padding: ${rem(4)} ${rem(10)};
    white-space: nowrap;
  }
  td:nth-child(3) {
    padding-left: ${rem(30)};
  }
  td:nth-child(4) {
    padding-left: ${rem(30)};
  }
`;
