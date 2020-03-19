import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import getSymbolFromCurrency from 'currency-symbol-map';
import { map } from 'lodash';
import formatNum from 'format-num';
import { css } from '@emotion/core';

import theme from '../../utils/theme';
import rem from '../../utils/rem';

import ChevronsLeftIcon from '../../assets/icons/chevrons-left.svg?sprite';

const groupByCurrency = (object) =>
  object.reduce((total, { currency, amount }) => {
    return {
      ...total,
      [currency]: (total[currency] || 0) + amount
    };
  }, {});

const AccountBalance = ({ balance }) => {
  const { pending, available } = balance;
  const groupedPendingBalance = groupByCurrency(pending);
  const groupedAvailableBalance = groupByCurrency(available);

  return (
    <Wrapper>
      <Title>Balance</Title>

      <NotesList>
        <Note>It takes 7-14 days for the first payout to get processed.</Note>
        <Note>Following payouts get processed on a daily basis.</Note>
      </NotesList>

      <RowWrapper>
        <Row>
          {map(groupedPendingBalance, (amount, currency) => (
            <Amount key={currency}>
              {getSymbolFromCurrency(currency)}
              <span>{formatNum(amount, { minFraction: 2 })}</span>
            </Amount>
          ))}
          <LightText>
            <ChevronsLeftIcon css={chevronsLeftIconStyles} />
            Balance under process
          </LightText>
        </Row>
        <Row>
          {map(groupedAvailableBalance, (amount, currency) => (
            <Amount key={currency}>
              {getSymbolFromCurrency(currency)}
              <span>{formatNum(amount, { minFraction: 2 })}</span>
            </Amount>
          ))}
          <LightText>
            <ChevronsLeftIcon css={chevronsLeftIconStyles} />
            Balance available for payout
          </LightText>
        </Row>
      </RowWrapper>
    </Wrapper>
  );
};

AccountBalance.propTypes = {
  balance: PropTypes.shape({
    pending: PropTypes.array,
    available: PropTypes.array
  })
};

export default AccountBalance;

/*
 ********************************************
 styled components
 ********************************************
 */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  color: ${theme.colors.links};
  font-size: ${rem(22)};

  display: flex;
  align-items: center;
`;

const RowWrapper = styled.div`
  margin-top: ${rem(5)};
`;
const Row = styled.div`
  display: flex;
  align-items: center;
`;

const LightText = styled.div`
  color: #6d7b86;
  margin-left: ${rem(5)};
  position: relative;
  top: -2px;
`;

const Amount = styled.div`
  color: ${theme.colors.links};
  font-size: ${rem(28)};

  :before {
    content: '+';
    margin: 0 ${rem(4)};
    color: #6d7b86;
  }
  :first-child:before {
    content: '';
    display: none;
  }

  span {
    margin-left: 2px;
  }
`;

const NotesList = styled.ul`
  list-style-type: circle;
  padding-left: 15px;
  margin: ${rem(4)} 0 ${rem(10)};
`;

const Note = styled.li`
  font-size: ${rem(14)};
  color: ${theme.colors.error};
`;

const chevronsLeftIconStyles = css`
  width: ${rem(17)};
  height: ${rem(17)};
  position: relative;
  top: 3px;
  margin-right: 3px;
`;
