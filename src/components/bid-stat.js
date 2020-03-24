import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import formatNum from 'format-num';
import { css } from '@emotion/core';

import { boxBorder } from '../styles/box';
import rem from '../utils/rem';
import theme from '../utils/theme';
import { msToTime } from '../utils/time';

const renderTime = (timeLeftInMs) => {
  const { hours, minutes, seconds } = msToTime(timeLeftInMs);
  if (hours > 24) {
    const endTime = new Date().setMilliseconds(timeLeftInMs);
    return `~${formatDistanceToNow(endTime)}`;
  }

  return `${hours}:${minutes}:${seconds}`;
};

export const TimeCounter = ({ timeLeftInMs }) => (
  <Box css={smallBoxStyles}>
    <Label>Time left:</Label>
    <Value>{renderTime(timeLeftInMs)}</Value>
  </Box>
);

TimeCounter.propTypes = {
  timeLeftInMs: PropTypes.number.isRequired
};

export const TopBid = ({ value }) => {
  return (
    <Box>
      <Label>Top bid:</Label>
      <Value>{`$${formatNum(value)}`}</Value>
    </Box>
  );
};
TopBid.propTypes = {
  value: PropTypes.number.isRequired
};

export const BidCount = ({ value }) => {
  return (
    <Box css={smallBoxStyles}>
      <Label>Bid count:</Label>
      <Value>{formatNum(value)}</Value>
    </Box>
  );
};
BidCount.propTypes = {
  value: PropTypes.number.isRequired
};

/*
 ********************************************
 styled components
 ********************************************
 */

const smallBoxStyles = css`
  width: 70%;
  justify-self: center;
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const Label = styled.div`
  color: ${theme.colors.label};
  font-size: ${rem(15)};
  flex: 1;
`;

const Value = styled.div`
  font-size: ${rem(35)};
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    font-size: ${rem(40)};
  }

  flex: 3;
  text-align: center;

  padding: ${rem(15)} ${rem(5)} ${rem(10)};
  font-variant: tabular-nums;
`;

const Box = styled.div`
  ${boxBorder};

  display: flex;
  flex-direction: column;

  padding: ${rem(12)};
  margin: 0;

  :nth-child(2) {
    box-shadow: #3273dc 0 7px 25px 0;
  }
`;
