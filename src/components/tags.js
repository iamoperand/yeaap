import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import rem from '../utils/rem';

const colorMapper = {
  WINNER: {
    border: '#1aae9f',
    background: '#8dd7cf'
  },
  HIGHEST_BID_WINS: {
    border: '#3e92dc',
    background: '#96c3ec'
  },
  CLOSEST_BID_WINS: {
    border: '#c346d5',
    background: '#de9ae8'
  },
  BIDS_VISIBLE: {
    border: '#ea8e4b',
    background: '#f3c19d'
  },
  BIDS_HIDDEN: {
    border: '#d3455b',
    background: '#e9a2ad'
  }
};

const Tag = ({ type, label }) => {
  return (
    <StyledTag type={type}>
      <span>{label}</span>
    </StyledTag>
  );
};
Tag.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

const types = {
  WINNER: 'WINNER',
  BIDS_VISIBLE: 'BIDS_VISIBLE',
  BIDS_HIDDEN: 'BIDS_HIDDEN',
  HIGHEST_BID_WINS: 'HIGHEST_BID_WINS',
  CLOSEST_BID_WINS: 'CLOSEST_BID_WINS'
};

export const WinnerTag = ({ label = 'Winner' }) => {
  return <Tag type={types.WINNER} label={label} />;
};
WinnerTag.propTypes = {
  label: PropTypes.string
};

export const BidsVisibleTag = () => {
  return <Tag type={types.BIDS_VISIBLE} label="Bids Visible" />;
};
export const BidsHiddenTag = () => {
  return <Tag type={types.BIDS_HIDDEN} label="Bids Hidden" />;
};
export const HighestBidWinsTag = () => {
  return <Tag type={types.HIGHEST_BID_WINS} label="Highest Bid Wins" />;
};
export const ClosestBidWinsTag = () => {
  return <Tag type={types.CLOSEST_BID_WINS} label="Closest Bid Wins" />;
};

/*
 ********************************************
 styled components
 ********************************************
 */

const commonStyles = css`
  display: inline-block;
  padding: ${rem(3)} ${rem(5)};
  font-size: ${rem(13)};
  text-transform: uppercase;
  color: #fff;
`;

const getBorderColor = (type) => {
  return colorMapper[type] ? colorMapper[type].border : '#fff';
};
const getBackgroundColor = (type) => {
  return colorMapper[type] ? colorMapper[type].background : '#fff';
};

const StyledTag = styled.div`
  ${commonStyles};
  border: ${(props) => `2px solid ${getBorderColor(props.type)}`};
  background-color: ${(props) => getBackgroundColor(props.type)};
  font-weight: 500;

  span {
    position: relative;
    top: 1px;
  }
`;
