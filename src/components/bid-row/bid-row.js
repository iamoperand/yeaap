import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { isEmpty } from 'lodash';
import formatNum from 'format-num';
import { css } from '@emotion/core';

import Message from './message';

import Avatar from '../avatar';

import rem from '../../utils/rem';
import theme from '../../utils/theme';

import SpeechBubbleIcon from '../../assets/icons/speech-bubble.svg?sprite';
import TrophyIcon from '../../assets/icons/trophy.svg?sprite';

const BidRow = ({
  bid,
  index,
  isUserCreator,
  showWinnerTag,
  size = 'normal'
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const toggleShowMessage = () => setShowMessage(!showMessage);

  const { creator } = bid;

  return (
    <>
      <tr className="data-row">
        <td>
          <Index size={size}>{`${index + 1}.`}</Index>
        </td>
        <td>
          <AmountInfo size={size}>
            <Amount>{`$${formatNum(bid.amount)}`}</Amount>
            {showWinnerTag && <TrophyIcon css={trophyIconStyles} />}
          </AmountInfo>
        </td>
        <td>
          <UserInfo size={size}>
            <Avatar src={creator.photoUrl} alt={creator.name} />
            <Name>{creator.name}</Name>
          </UserInfo>
        </td>
        <td>
          {isUserCreator && !isEmpty(bid.message) && (
            <SpeechBubbleIcon
              onClick={toggleShowMessage}
              css={css`
                ${speechBubbleIconStyles};
                fill: ${showMessage ? theme.colors.primary : '#788896'};
                :hover {
                  fill: ${theme.colors.primary};
                }
              `}
            />
          )}
        </td>
      </tr>

      <tr className="no-hover">
        <td colSpan="4">
          <Message isOpen={showMessage} message={bid.message} />
        </td>
      </tr>
    </>
  );
};

BidRow.propTypes = {
  bid: PropTypes.shape().isRequired,
  index: PropTypes.number.isRequired,
  isUserCreator: PropTypes.bool.isRequired,
  showWinnerTag: PropTypes.bool.isRequired,
  size: PropTypes.oneOf(['normal', 'large'])
};

export default BidRow;

/*
 ********************************************
 styled components
 ********************************************
 */

const UserInfo = styled.div`
  width: ${rem(150)};
  display: flex;
  align-items: center;
  white-space: normal;
  img {
    height: ${rem(30)};
    width: ${rem(30)};
    border-radius: 50%;
  }
`;

const trophyIconStyles = css`
  position: relative;
  top: -1px;
  width: ${rem(15)};
  height: ${rem(15)};
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    width: ${rem(30)};
    height: ${rem(30)};
  }
`;

const Index = styled.div`
  color: #3a3a3a;
  user-select: none;
  font-size: ${rem(14)};
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    font-size: ${rem(18)};
  }
`;

const AmountInfo = styled.div`
  display: flex;
  align-items: center;

  width: ${rem(120)};
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    width: ${rem(150)};
  }
`;

const Name = styled.div`
  margin-left: ${rem(10)};
  font-size: ${rem(17)};
  position: relative;
  top: 2px;
`;

const Amount = styled.span`
  font-size: ${rem(22)};
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    font-size: ${rem(28)};
  }
  font-variant: tabular-nums;
  color: ${theme.colors.primary};
  margin-right: ${rem(10)};
  position: relative;
  top: 1px;
`;

const speechBubbleIconStyles = css`
  position: relative;
  top: 2px;
  cursor: pointer;
  height: ${rem(17)};
  width: ${rem(17)};
  user-select: none;
`;
