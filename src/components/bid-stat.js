import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {
  differenceInMilliseconds,
  differenceInHours,
  formatDistanceToNow
} from 'date-fns';
import formatNum from 'format-num';

import { boxBorder } from '../styles/box';
import rem from '../utils/rem';
import theme from '../utils/theme';
import useInterval from '../hooks/use-interval';

const msToTime = (duration) => {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return { hours, minutes, seconds };
};

const getDuration = (endTime, currentTime) => {
  const duration = differenceInMilliseconds(endTime, currentTime);
  if (duration < 0) {
    return 0;
  }
  return duration;
};

const showApproxTime = (endTime) => {
  const hourlyDifference = differenceInHours(endTime, new Date());
  if (hourlyDifference >= 24) {
    return true;
  }
  return false;
};

const formattedTime = (endTime) => {
  return `~${formatDistanceToNow(endTime)}`;
};

export const TimeCounter = ({ endTime }) => {
  const end = new Date(endTime);

  const [duration, setDuration] = useState(() => {
    return getDuration(end, new Date());
  });
  useInterval(() => {
    setDuration(getDuration(end, new Date()));
  }, 1000);

  const { hours, minutes, seconds } = msToTime(duration);

  return (
    <Box>
      <Label>Time left:</Label>
      <Value>
        {showApproxTime(end)
          ? formattedTime(end)
          : `${hours}:${minutes}:${seconds}`}
      </Value>
    </Box>
  );
};
TimeCounter.propTypes = {
  endTime: PropTypes.string.isRequired
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
    <Box>
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
