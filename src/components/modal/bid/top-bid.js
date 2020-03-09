import React from 'react';
import PropTypes from 'prop-types';
import formatNum from 'format-num';
import styled from '@emotion/styled';

import rem from '../../../utils/rem';

import { labelBasic } from '../../../styles/form';

const TopBid = ({ amount }) => {
  if (!amount) {
    return null;
  }
  return (
    <Wrapper>
      <Title>Top bid: </Title>
      <Amount>{`$${formatNum(amount)}`}</Amount>
    </Wrapper>
  );
};

TopBid.propTypes = {
  amount: PropTypes.number.isRequired
};

export default TopBid;

/*
 ********************************************
 styled components
 ********************************************
 */

const Wrapper = styled.div`
  margin-bottom: ${rem(20)};
  text-align: center;
  ${labelBasic};
  font-size: ${rem(17)};
  font-weight: 400;
`;

const Title = styled.span``;

const Amount = styled.span`
  font-size: ${rem(19)};
`;
