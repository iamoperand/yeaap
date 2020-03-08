import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { isEmpty } from 'lodash';
import formatNum from 'format-num';

import Avatar from './avatar';

import rem from '../utils/rem';
import theme from '../utils/theme';
import { box3DBorder } from '../styles/box';

const Leaderboard = ({ bids, winnerCount }) => {
  if (isEmpty(bids)) {
    return <div>{`Bids haven't been registered yet!`}</div>;
  }

  return (
    <List>
      {bids.map((bid, index) => {
        const { id, amount, message, creator } = bid;

        const serial = index + 1;
        return (
          <ListItem key={id} primary={serial <= winnerCount ? true : false}>
            <Content>
              <Stats>
                <Index>#{serial}</Index>
                <Avatar src={creator.photoUrl} alt={creator.name} />
                <Name>{creator.name}</Name>
                <LightText>bid</LightText>
                <BidAmount>${formatNum(amount)}</BidAmount>
              </Stats>
              <Message>
                <MessageText>{`"${message}"`}</MessageText>
              </Message>
            </Content>
          </ListItem>
        );
      })}
    </List>
  );
};

Leaderboard.propTypes = {
  bids: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      message: PropTypes.string,
      creator: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        photoUrl: PropTypes.string
      })
    })
  ),
  winnerCount: PropTypes.number.isRequired
};

export default Leaderboard;

/*
 ********************************************
 styled components
 ********************************************
 */

const List = styled.ul`
  margin: ${rem(15)} 0;
  padding: 0;

  font-size: ${rem(17)};
`;

const ListItem = styled.li`
  text-align: center;
  margin: ${rem(30)} 0;

  img {
    height: ${rem(50)};
    width: ${rem(50)};
    border-radius: 50%;
    box-shadow: rgba(60, 66, 87, 0.12) 0px 7px 14px 0px,
      rgba(0, 0, 0, 0.12) 0px 3px 6px 0px;
  }

  display: flex;
  justify-content: center;
  align-items: center;

  ${box3DBorder};

  :first-child {
    margin-top: ${rem(50)};
  }

  :after {
    box-shadow: ${({ primary }) => primary && '#3273dc -3px 0px 25px 2px'};
  }
  margin-bottom: ${({ primary }) => primary && rem(80)};
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  padding: ${rem(30)} ${rem(35)} ${rem(30)} ${rem(30)};
  width: 100%;
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Message = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  color: #6a687f;
  text-align: left;

  margin-top: ${rem(20)};
  width: 90%;
`;

const MessageText = styled.span`
  padding: ${rem(5)} 0 ${rem(5)} ${rem(10)};
  border-left: 5px solid rgb(87, 62, 222);
`;

const Index = styled.span`
  font-weight: 500;
  margin-right: ${rem(4)};

  min-width: ${rem(30)};
  text-align: center;
`;

const Name = styled.span`
  margin-left: ${rem(8)};

  position: relative;
  :after {
    content: '';
    width: 100%;
    position: absolute;
    left: 0;
    bottom: -1px;
    border-width: 0 0 2px;
    border-style: solid;
    border-color: #818181;
  }
`;

const BidAmount = styled.span`
  font-weight: 500;
  font-size: ${rem(21)};
  font-variant: tabular-nums;
`;

const LightText = styled.span`
  margin: 0 ${rem(6)};
  color: ${theme.colors.label};
`;
