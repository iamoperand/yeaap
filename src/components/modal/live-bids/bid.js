import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import formatNum from 'format-num';
import { isEmpty } from 'lodash';

import rem from '../../../utils/rem';
import theme from '../../../utils/theme';

import { WinnerTag } from '../../tags';
import Avatar from '../../avatar';
import Message from './message';

import SpeechBubbleIcon from '../../../assets/icons/speech-bubble.svg?sprite';

const WinningTag = () => (
  <WinnerTagStyles>
    <WinnerTag label="Winning" />
  </WinnerTagStyles>
);

const Bid = ({ bid, index, isUserCreator, isWinning }) => {
  const [showMessage, setShowMessage] = useState(false);
  const toggleShowMessage = () => setShowMessage(!showMessage);

  const { creator } = bid;

  return (
    <>
      <tr>
        <td>
          <Index>{`${index + 1}.`}</Index>
        </td>
        <td>
          <AmountInfo>
            <Amount>{`$${formatNum(bid.amount)}`}</Amount>
            {isWinning && <WinningTag />}
          </AmountInfo>
        </td>
        <td>
          <UserInfo>
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

      <tr>
        <td colSpan="4">
          <Message isOpen={showMessage} message={bid.message} />
        </td>
      </tr>
    </>
  );
};

Bid.propTypes = {
  bid: PropTypes.shape().isRequired,
  index: PropTypes.number.isRequired,
  isUserCreator: PropTypes.bool.isRequired,
  isWinning: PropTypes.bool.isRequired
};

export default Bid;

/*
 ********************************************
 styled components
 ********************************************
 */

const UserInfo = styled.div`
  display: flex;
  align-items: center;
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
  width: ${rem(30)};
`;

const AmountInfo = styled.div`
  display: block;
  width: ${rem(180)};
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
  top: 1px;
  cursor: pointer;
  height: ${rem(20)};
  width: ${rem(20)};
  fill: ${(props) => (props.isMessageShown ? theme.colors.primary : '#788896')};
  :hover {
    fill: ${theme.colors.primary};
  }
  user-select: none;
`;
