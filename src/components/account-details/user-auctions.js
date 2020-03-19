import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from 'next/link';

import theme from '../../utils/theme';
import rem from '../../utils/rem';

import AuctionList from '../auction-list';

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

      <AuctionList auctionConnection={auctionConnection} />
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
