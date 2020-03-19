import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from 'next/link';
import { isEmpty } from 'lodash';

import theme from '../../utils/theme';
import rem from '../../utils/rem';

import BidList from '../bid-list';

const UserBids = ({ bidConnection }) => {
  if (isEmpty(bidConnection.edges)) {
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

      <BidList bidConnection={bidConnection} />
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
