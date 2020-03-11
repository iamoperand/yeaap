import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import formatNum from 'format-num';
import styled from '@emotion/styled';
import format from 'date-fns/format';

import Avatar from '../../avatar';
import { WinnerTag } from '../../tag';

import rem from '../../../utils/rem';
import theme from '../../../utils/theme';

const shouldShowWinningTag = ({ serialNo, winnerCount, auctionType }) => {
  switch (auctionType) {
    case 'HIGHEST_BID_WINS': {
      return serialNo <= winnerCount;
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

  return bids.map((bid, index) => {
    const serialNo = index + 1;
    const showWinningTag = shouldShowWinningTag({
      serialNo,
      winnerCount,
      auctionType
    });
    const createdAt = format(new Date(bid.createdAt), 'do LLLL, HH:mm');

    return (
      <Wrapper key={bid.id}>
        <AmountRow>
          <AmountTag>
            <Amount>{`$${formatNum(bid.amount)}`}</Amount>
            {showWinningTag && <WinnerTag label="Winning" />}
          </AmountTag>
          <Time>{createdAt}</Time>
        </AmountRow>

        <UserRow>
          <Avatar src={bid.creator.photoUrl} alt={bid.creator.name} />
          <Name>{bid.creator.name}</Name>
        </UserRow>

        <UserRow>
          {isUserCreator && <Message>{`"${bid.message}"`}</Message>}
        </UserRow>
      </Wrapper>
    );
  });
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

const Wrapper = styled.div`
  box-shadow: inset 0 -1px #bfc2c5;
  :last-child {
    box-shadow: none;
  }

  padding: ${rem(15)} ${rem(30)};

  display: flex;
  flex-direction: column;
  justify-content: center;

  img {
    height: ${rem(40)};
    width: ${rem(40)};
    border-radius: 50%;
    box-shadow: rgba(60, 66, 87, 0.12) 0px 7px 14px 0px,
      rgba(0, 0, 0, 0.12) 0px 3px 6px 0px;
  }
`;

const AmountRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: ${rem(5)};
`;

const AmountTag = styled.div`
  display: flex;
  align-items: center;
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: ${rem(5)};
  :last-child {
    margin-bottom: 0;
  }
`;

const Name = styled.div`
  margin-left: ${rem(8)};

  position: relative;
  :after {
    content: '';
    width: 100%;
    position: absolute;
    left: 0;
    bottom: -1px;
    border-width: 0 0 2px;
    border-style: solid;
    border-color: #818181;
  }
`;

const Amount = styled.div`
  font-size: ${rem(25)};
  font-variant: tabular-nums;
  color: ${theme.colors.links};
  margin-right: ${rem(10)};
  position: relative;
  top: 1px;
`;

const Time = styled.small`
  font-variant: tabular-nums;
  color: ${theme.colors.label};
  font-size: ${rem(15)};
`;

const Message = styled.small`
  margin-left: ${rem(48)};
  position: relative;
  top: -${rem(5)};

  color: ${theme.colors.label};
  font-size: ${rem(15)};
`;
