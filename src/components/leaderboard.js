import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import formatNum from 'format-num';
import { isEmpty, take } from 'lodash';
import { useModal } from 'react-modal-hook';

import Avatar from './avatar';
import LiveBidsModal from './modal/live-bids';
import { WinnerTag } from './tags';

import { boxBorder } from '../styles/box';

import rem from '../utils/rem';
import theme from '../utils/theme';

import useSession from '../hooks/use-session';

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

const Leaderboard = ({ bids, creatorId, winnerCount, auctionType }) => {
  const { user } = useSession();

  const [showLiveBids, hideLiveBids] = useModal(
    () => (
      <LiveBidsModal
        onClose={hideLiveBids}
        bids={bids}
        creatorId={creatorId}
        userId={user.id}
        winnerCount={winnerCount}
        auctionType={auctionType}
      />
    ),
    [bids, creatorId, user.id, winnerCount, auctionType]
  );

  if (isEmpty(bids)) {
    return (
      <Box>
        <Label>Leaderboard</Label>
        <H3>No bids yet!</H3>
      </Box>
    );
  }

  const first4Bids = take(bids, 4);

  return (
    <Box>
      <Label>Live bids</Label>
      <List>
        {first4Bids.map((bid, index) => (
          <Item key={bid.id}>
            <Index>#</Index>
            <Avatar src={bid.creator.photoUrl} alt={bid.creator.name} />
            <Name>{bid.creator.name}</Name>
            <span
              css={css`
                margin: 0 ${rem(4)};
                color: ${theme.colors.label};
              `}
            >
              bid
            </span>
            <BidAmount>${formatNum(bid.amount)}</BidAmount>
            {showWinning({ index, winnerCount, auctionType }) && (
              <TagWrapper>
                <WinnerTag label="Winning" />
              </TagWrapper>
            )}
          </Item>
        ))}
      </List>

      <Button onClick={showLiveBids}>See top 20 bids</Button>
    </Box>
  );
};

export default Leaderboard;

Leaderboard.propTypes = {
  bids: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      message: PropTypes.string,
      creator: PropTypes.shape({
        name: PropTypes.string.isRequired,
        photoUrl: PropTypes.string
      })
    })
  ),
  creatorId: PropTypes.string.isRequired,
  winnerCount: PropTypes.number.isRequired,
  auctionType: PropTypes.oneOf(['HIGHEST_BID_WINS', 'CLOSEST_BID_WINS'])
};

/*
 ********************************************
 styled components
 ********************************************
 */

const Box = styled.div`
  ${boxBorder};
  padding: ${rem(20)};
`;

const Label = styled.div`
  color: ${theme.colors.links};
  font-size: ${rem(19)};
`;

const List = styled.ul`
  margin: ${rem(15)} 0 ${rem(20)} 0;
  padding-left: 0;
  min-height: ${rem(100)};
`;

const Item = styled.li`
  display: flex;
  align-items: center;

  margin: ${rem(4)} 0;

  img {
    height: ${rem(30)};
    width: ${rem(30)};
    border-radius: 50%;
    box-shadow: rgba(60, 66, 87, 0.12) 0px 7px 14px 0px,
      rgba(0, 0, 0, 0.12) 0px 3px 6px 0px;
  }
`;

const Index = styled.span`
  font-weight: bold;
  margin-right: ${rem(4)};
`;

const Name = styled.span`
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

const BidAmount = styled.span`
  font-weight: 500;
  font-size: ${rem(18)};
  font-variant: tabular-nums;
`;

const Button = styled.button`
  font-size: ${rem(18)};
  padding: 0;
  color: ${theme.colors.links};
  text-decoration: none;
  position: relative;
  cursor: pointer;

  :after {
    content: '';
    width: 100%;
    position: absolute;
    left: 0;
    bottom: -1px;
    border-width: 0 0 2px;
    border-style: solid;
    border-color: #c7c3fb;
  }
`;

const H3 = styled.div`
  font-size: ${rem(18)};
  margin-top: ${rem(15)};
`;

const TagWrapper = styled.div`
  margin-left: ${rem(8)};
  position: relative;
  top: -2px;
`;
