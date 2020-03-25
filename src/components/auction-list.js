import React from 'react';
import PropTypes from 'prop-types';
import { isPast, formatDistance } from 'date-fns';
import { capitalize } from 'lodash';
import styled from '@emotion/styled';
import Link from 'next/link';

import rem from '../utils/rem';
import theme from '../utils/theme';

import { boxBorder } from '../styles/box';

import {
  BidsVisibleTag,
  BidsHiddenTag,
  HighestBidWinsTag,
  ClosestBidWinsTag
} from './tags';

const statusEnum = {
  active: 'active',
  cancelled: 'cancelled',
  ended: 'ended',
  processing: 'processing'
};

const computeTimeLeft = (endsAt) =>
  formatDistance(new Date(endsAt), new Date(), { addSuffix: true });

const getAuctionStatus = ({ auction }) => {
  const { isCanceled, isSettled, endsAt } = auction;

  if (isCanceled) {
    return statusEnum.cancelled;
  }
  if (isSettled) {
    return statusEnum.ended;
  }

  if (isPast(new Date(endsAt))) {
    return statusEnum.processing;
  }

  return statusEnum.active;
};

const AuctionList = ({ auctionConnection }) => {
  return (
    <Auctions>
      {auctionConnection.edges.map(({ node: auction }) => {
        const { id, hasBidsVisible, isSettled, description, endsAt } = auction;

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
                {isActive && <TimeLeft>{timeLeft}</TimeLeft>}
                {isSettled && <TimeLeft>{timeLeft}</TimeLeft>}
              </div>
              <Link href="/auction/[auctionId]" as={`/auction/${id}`} passHref>
                <a>View auction</a>
              </Link>
            </Row>
          </Auction>
        );
      })}
    </Auctions>
  );
};

AuctionList.propTypes = {
  auctionConnection: PropTypes.shape({ edges: PropTypes.array.isRequired })
    .isRequired
};

export default AuctionList;

/*
 ********************************************
 styled components
 ********************************************
 */

const Auctions = styled.div`
  display: grid;
  grid-gap: ${rem(20)} ${rem(50)};

  grid-template-columns: 1fr;
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  margin-top: ${rem(20)};
`;

const Auction = styled.div`
  ${boxBorder};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
