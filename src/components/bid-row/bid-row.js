import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { isEmpty } from 'lodash';
import formatNum from 'format-num';

import Message from './message';
import { WinnerTag } from '../tags';
import Avatar from '../avatar';

import rem from '../../utils/rem';
import theme from '../../utils/theme';

import SpeechBubbleIcon from '../../assets/icons/speech-bubble.svg?sprite';

const WinningTag = ({ label }) => (
  <WinnerTagStyles>
    <WinnerTag label={label} />
  </WinnerTagStyles>
);
WinningTag.propTypes = {
  label: PropTypes.string.isRequired
};

const getWidth = ({ type, size }) => {
  switch (type) {
    case 'index': {
      if (size === 'large') {
        return 40;
      }
      return 30;
    }
    case 'amount': {
      if (size === 'large') {
        return 200;
      }
      return 200;
    }
    case 'user': {
      if (size === 'large') {
        return 150;
      }
      return 150;
    }
    default: {
      throw new Error('no type specified');
    }
  }
};

const BidRow = ({
  bid,
  index,
  isUserCreator,
  showWinnerTag,
  winnerTagLabel,
  size = 'normal'
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const toggleShowMessage = () => setShowMessage(!showMessage);

  const { creator } = bid;

  return (
    <>
      <tr>
        <td>
          <Index size={size}>{`${index + 1}.`}</Index>
        </td>
        <td>
          <AmountInfo size={size}>
            <Amount>{`$${formatNum(bid.amount)}`}</Amount>
            {showWinnerTag && <WinningTag label={winnerTagLabel} />}
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
            <IconStyles>
              <StyledSpeechBubbleIcon
                onClick={toggleShowMessage}
                isMessageShown={showMessage}
              />
            </IconStyles>
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
  winnerTagLabel: PropTypes.string,
  size: PropTypes.oneOf(['normal', 'large'])
};

export default BidRow;

/*
 ********************************************
 styled components
 ********************************************
 */

const UserInfo = styled.div`
  width: ${(props) => rem(getWidth({ type: 'user', size: props.size }))};
  display: flex;
  align-items: center;
  white-space: normal;
  img {
    height: ${rem(30)};
    width: ${rem(30)};
    border-radius: 50%;
  }
`;

const WinnerTagStyles = styled.div`
  display: inline-block;
  position: relative;
  top: -4px;
`;

const Index = styled.div`
  color: #3a3a3a;
  font-size: ${rem(18)};
  user-select: none;
  width: ${(props) => rem(getWidth({ type: 'index', size: props.size }))};
`;

const AmountInfo = styled.div`
  display: block;
  width: ${(props) => rem(getWidth({ type: 'amount', size: props.size }))};
`;

const Name = styled.div`
  margin-left: ${rem(10)};
  font-size: ${rem(17)};
  position: relative;
  top: 2px;
`;

const Amount = styled.span`
  font-size: ${rem(28)};
  font-variant: tabular-nums;
  color: ${theme.colors.primary};
  margin-right: ${rem(10)};
  position: relative;
  top: 1px;
`;

const IconStyles = styled.div`
  position: relative;
`;

const StyledSpeechBubbleIcon = styled(SpeechBubbleIcon)`
  position: relative;
  top: 2px;
  cursor: pointer;
  height: ${rem(17)};
  width: ${rem(17)};
  fill: ${(props) => (props.isMessageShown ? theme.colors.primary : '#788896')};
  :hover {
    fill: ${theme.colors.primary};
  }
  user-select: none;
`;
