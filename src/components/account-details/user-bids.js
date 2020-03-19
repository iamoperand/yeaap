import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from 'next/link';
import { isEmpty } from 'lodash';
import formatNum from 'format-num';
import formatDistance from 'date-fns/formatDistance';

import theme from '../../utils/theme';
import rem from '../../utils/rem';

import { boxBorder } from '../../styles/box';

import { WinnerTag } from '../tags';

const computeTimeDistance = (endsAt) =>
  formatDistance(new Date(endsAt), new Date(), { addSuffix: true });

const UserBids = ({ bidConnection }) => {
  if (!bidConnection) {
    return (
      <Wrapper>
        <Title>Bids</Title>
        <NullWarning>{"You don't have any bids to show."}</NullWarning>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Title>
        Bids
        <Link href="/me/bids">
          <a>View more</a>
        </Link>
      </Title>

      <Bids>
        {bidConnection.edges.map(({ node: bid }) => {
          const {
            amount,
            message,
            isWinner,
            auctionId,
            auction,
            createdAt
          } = bid;
          const { creator } = auction;

          return (
            <Bid key={bid.id}>
              <AmountRow>
                <AmountValue>
                  {'$' + formatNum(amount)}
                  {isWinner && <WinnerTag />}
                </AmountValue>
                <TimeLeft>{computeTimeDistance(createdAt)}</TimeLeft>
              </AmountRow>
              <Description>
                {!isEmpty(message) ? message : 'No message'}
              </Description>

              <AuctionInfo>
                <div>
                  Auction by<span>{creator.name}</span>
                </div>

                <Link
                  href="/auction/[auctionId]"
                  as={`/auction/${auctionId}`}
                  passHref
                >
                  <a>View auction</a>
                </Link>
              </AuctionInfo>
            </Bid>
          );
        })}
      </Bids>
    </Wrapper>
  );
};

UserBids.propTypes = {
  bidConnection: PropTypes.shape({ edges: PropTypes.array.isRequired })
    .isRequired
};

export default UserBids;

/*
 ********************************************
 styled components
 ********************************************
 */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const NullWarning = styled.div`
  margin-top: ${rem(10)};
  color: #303f4b;
  font-size: ${rem(18)};
`;

const Title = styled.div`
  color: ${theme.colors.links};
  font-size: ${rem(22)};

  display: flex;
  align-items: center;

  a {
    font-size: ${rem(15)};
    color: #788188;
    margin-left: ${rem(10)};
  }
`;

const Bids = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: ${rem(20)} ${rem(50)};

  margin-top: ${rem(20)};
`;

const Bid = styled.div`
  ${boxBorder};
  padding: ${rem(10)};
`;

const AmountRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const AmountValue = styled.div`
  font-size: ${rem(24)};
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;

  > div:nth-child(1) {
    margin-left: ${rem(5)};
    position: relative;
    top: -3px;
  }
`;

const Description = styled.div`
  color: #303f4b;
  font-size: ${rem(17)};
  margin: ${rem(6)} 0 ${rem(20)};
`;

const AuctionInfo = styled.div`
  color: #788188;
  font-size: ${rem(15)};
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    font-size: ${rem(16)};
  }

  span {
    margin-left: ${rem(3.5)};
    color: #303f4b;
  }
`;

const TimeLeft = styled.div`
  color: #788188;
  font-size: ${rem(15)};
`;
