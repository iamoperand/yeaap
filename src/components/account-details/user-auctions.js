import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { capitalize } from 'lodash';
import formatDistance from 'date-fns/formatDistance';
import Link from 'next/link';

import theme from '../../utils/theme';
import rem from '../../utils/rem';

import { boxBorder } from '../../styles/box';

import {
  BidsVisibleTag,
  BidsHiddenTag,
  HighestBidWinsTag,
  ClosestBidWinsTag
} from '../tags';

const statusEnum = {
  active: 'active',
  cancelled: 'cancelled',
  ended: 'ended'
};

const computeTimeLeft = (endsAt) =>
  formatDistance(new Date(endsAt), new Date());

const getAuctionStatus = ({ auction }) => {
  const { isCanceled, isSettled } = auction;

  if (isCanceled) {
    return statusEnum.cancelled;
  }
  if (isSettled) {
    return statusEnum.ended;
  }
  return statusEnum.active;
};

const UserAuctions = ({ auctionConnection }) => {
  if (!auctionConnection) {
    return (
      <Wrapper>
        <Title>Auctions</Title>
        <NullWarning>{"You don't have any auctions to show."}</NullWarning>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Title>
        Auctions
        <Link href="/me/auctions">
          <a>View more</a>
        </Link>
      </Title>

      <Auctions>
        {auctionConnection.edges.map(({ node: auction }) => {
          const {
            id,
            hasBidsVisible,
            isSettled,
            description,
            endsAt
          } = auction;

          const isHighestBidWinner = auction.type === 'HIGHEST_BID_WINS';

          const status = getAuctionStatus({ auction });
          const isActive = status === 'active';

          const timeLeft = (isActive || isSettled) && computeTimeLeft(endsAt);

          return (
            <Auction key={auction.id}>
              <Description>{description}</Description>
              <Tags>
                {isHighestBidWinner ? (
                  <HighestBidWinsTag />
                ) : (
                  <ClosestBidWinsTag />
                )}
                &nbsp;{hasBidsVisible ? <BidsVisibleTag /> : <BidsHiddenTag />}
              </Tags>

              <Row>
                <div>
                  <Status status={status}>{capitalize(status)}</Status>
                  {isActive && <TimeLeft>{`ends in ${timeLeft}`}</TimeLeft>}
                  {isSettled && <TimeLeft>{`${timeLeft} ago`}</TimeLeft>}
                </div>
                <Link
                  href="/auction/[auctionId]"
                  as={`/auction/${id}`}
                  passHref
                >
                  <a>View auction</a>
                </Link>
              </Row>
            </Auction>
          );
        })}
      </Auctions>
    </Wrapper>
  );
};

UserAuctions.propTypes = {
  auctionConnection: PropTypes.shape({ edges: PropTypes.array.isRequired })
    .isRequired
};

export default UserAuctions;

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

const Auctions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: ${rem(20)} ${rem(50)};

  margin-top: ${rem(20)};
`;

const Auction = styled.div`
  ${boxBorder};
  padding: ${rem(10)};
`;

const Description = styled.div`
  color: #303f4b;
  font-size: ${rem(18)};
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: ${rem(10)} 0 ${rem(20)};
`;

const getStatusColor = (status) => {
  switch (status) {
    case statusEnum.cancelled: {
      return '#788188';
    }
    case statusEnum.ended: {
      return '#ce1126';
    }
    case statusEnum.active: {
      return '#0da595';
    }
    default: {
      return '#788188';
    }
  }
};

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Status = styled.span`
  color: ${(props) => getStatusColor(props.status)};
  font-size: ${rem(15)};
`;

const TimeLeft = styled.span`
  color: #788188;
  font-size: ${rem(15)};
  margin-left: ${rem(5)};
`;
