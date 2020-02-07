import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Link from 'next/link';

import Avatar from './avatar';

import { boxBorder } from '../styles/box';
import rem from '../utils/rem';
import theme from '../utils/theme';

const Leaderboard = ({ bidId, data }) => {
  const currency = '$';

  return (
    <Box>
      <Label>Leaderboard</Label>
      <List>
        {data.map((entry, index) => (
          <Item key={entry.username}>
            <Index>#{index + 1}</Index>
            <Avatar src={entry.avatar} alt={entry.name} />
            <Name>{entry.name}</Name>
            <span
              css={css`
                margin: 0 ${rem(4)};
                color: ${theme.colors.label};
              `}
            >
              bid
            </span>
            <BidAmount>
              {currency}
              {entry.bid}
            </BidAmount>
          </Item>
        ))}
      </List>

      <Link href={`/leaderboard/[id]`} as={`/leaderboard/${bidId}`}>
        <Anchor>See all</Anchor>
      </Link>
    </Box>
  );
};

export default Leaderboard;

Leaderboard.propTypes = {
  bidId: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape())
};

/*
 ********************************************
 styled components
 ********************************************
 */

const Box = styled.div`
  ${boxBorder};
  padding: ${rem(12)};
`;

const Label = styled.div`
  color: ${theme.colors.links};
  font-size: ${rem(19)};
`;

const List = styled.ul`
  margin: ${rem(15)} 0;
`;

const Item = styled.li`
  display: flex;
  align-items: center;

  margin: ${rem(8)} 0;

  img {
    height: ${rem(20)};
    width: ${rem(20)};
  }
`;

const Index = styled.span`
  font-weight: bold;
  margin-right: ${rem(4)};
`;

const Name = styled.span`
  margin-left: ${rem(4)};
`;

const BidAmount = styled.span`
  font-weight: bold;
`;

const Anchor = styled.a`
  font-size: ${rem(18)};
`;
