import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { boxBorder } from '../styles/box';
import rem from '../utils/rem';
import theme from '../utils/theme';

const BidStat = ({ label, value, type }) => {
  const bidCurrency = '$';
  return (
    <Box>
      <Label>{label}</Label>
      <Value>
        {type === 'currency' ? bidCurrency : null}
        {value}
      </Value>
    </Box>
  );
};

BidStat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  type: PropTypes.string
};

export default BidStat;

/*
 ********************************************
 styled components
 ********************************************
 */

const Box = styled.div`
  ${boxBorder};

  display: flex;
  flex-direction: column;

  padding: ${rem(12)};
  margin: 0 ${rem(25)};
  :first-child {
    margin: 0;
  }
  :last-child {
    margin: 0;
  }
`;

const Label = styled.div`
  color: ${theme.colors.label};
  font-size: ${rem(15)};
  flex: 1;
`;

const Value = styled.div`
  font-size: ${rem(40)};
  flex: 3;
  text-align: center;

  padding: ${rem(15)} ${rem(5)} ${rem(10)};
`;
