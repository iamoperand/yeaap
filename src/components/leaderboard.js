import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Link from 'next/link';
import formatNum from 'format-num';
import { isEmpty } from 'lodash';

import Avatar from './avatar';
import { boxBorder } from '../styles/box';
import rem from '../utils/rem';
import theme from '../utils/theme';

const Leaderboard = ({ bids, auctionId }) => {
  if (isEmpty(bids)) {
    return (
      <Box>
        <Label>Leaderboard</Label>
        <H3>No bids yet!</H3>
      </Box>
    );
  }

  return (
    <Box>
      <Label>Leaderboard</Label>

      <List>
        {bids.map((bid, index) => (
          <Item key={bid.id}>
            <Index>#{index + 1}</Index>
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
          </Item>
        ))}
      </List>

      <Link
        href={`/auction/[auctionId]/bids`}
        as={`/auction/${auctionId}/bids`}
        passHref
      >
        <Anchor>See all</Anchor>
      </Link>
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
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        photoUrl: PropTypes.string
      })
    })
  ),
  auctionId: PropTypes.string.isRequired
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

const Anchor = styled.a`
  font-size: ${rem(18)};
`;

const H3 = styled.div`
  font-size: ${rem(18)};
  margin-top: ${rem(15)};
`;
