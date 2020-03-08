import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useToasts } from 'react-toast-notifications';
import { useForm } from 'react-hook-form';
import { get, isInteger } from 'lodash';
import formatNum from 'format-num';

import {
  modalBasic,
  modalCentered,
  modalPadding,
  modalBorder,
  modalOverlay
} from '../../styles/modal';
import { labelBasic, inputBasic } from '../../styles/form';
import { buttonPrimary, buttonWhite, buttonRounded } from '../../styles/button';
import { box3DBorder } from '../../styles/box';
import { errorBasic } from '../../styles/form';

import rem from '../../utils/rem';
import { getErrorMessage } from '../../utils/error';

const CREATE_BID = gql`
  # input BidCreateInput {
  #   paymentMethodId: String!
  #   amount: Int!
  #   message: String
  # }
  mutation createBid($where: AuctionWhereInput!, $data: BidCreateInput!) {
    createBid(where: $where, data: $data) {
      id
      amount
      message
    }
  }
`;

const schema = {
  amount: (topBid) => ({
    min: {
      value: topBid + 1,
      message: `Has to be between $${formatNum(topBid)} - $10,000.`
    },
    max: {
      value: 9999,
      message: `Can't be greater than $9,999.`
    },
    validate: (value) => isInteger(+value) || 'Amount should be an integer.',
    required: 'Amount is required.'
  }),
  message: {
    maxLength: {
      value: 256,
      message: `Can't be more than 256 characters long.`
    }
  }
};

const Bid = ({ onClose, auctionId, topBid }) => {
  const { addToast } = useToasts();

  const [createBid] = useMutation(CREATE_BID, {
    onError: (error) => {
      addToast(getErrorMessage(error), {
        appearance: 'error'
      });
      onClose();
    },
    onCompleted: (data) => {
      addToast(`You just bid for $${data.createBid.amount}, congrats!`, {
        appearance: 'success',
        autoDismiss: true
      });
      onClose();
    }
  });

  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    createBid({
      variables: {
        where: {
          auctionId
        },
        data: {
          ...data,
          amount: +data.amount
        }
      }
    });
  };

  return (
    <ReactModal
      style={{ overlay: modalOverlay }}
      css={modalContent}
      isOpen={true}
      onRequestClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <TopBid>
          {topBid ? (
            <p>
              Top bid: <span>{`$${formatNum(topBid)}`}</span>
            </p>
          ) : (
            <p>No bids yet!</p>
          )}
        </TopBid>

        <Row>
          <Label htmlFor="amount">Bid amount:</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="$100"
            ref={register(schema.amount(topBid))}
          />
          <Error>{get(errors, 'amount.message')}</Error>
        </Row>

        <Row>
          <Label htmlFor="message">Message:</Label>
          <TextArea
            id="message"
            name="message"
            placeholder="Any short message you'd like to add?"
            ref={register(schema.message)}
          />
          <Error>{get(errors, 'message.message')}</Error>
        </Row>

        <CTARow>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <PrimaryButton type="submit">Bid</PrimaryButton>
        </CTARow>
      </form>
    </ReactModal>
  );
};

Bid.propTypes = {
  onClose: PropTypes.func.isRequired,
  auctionId: PropTypes.string.isRequired,
  topBid: PropTypes.number.isRequired
};

export default Bid;

/*
 ********************************************
 styled components
 ********************************************
 */

const modalContent = css`
  ${modalBasic};
  ${modalCentered};
  ${modalBorder};
  ${modalPadding};
`;

const Row = styled.div`
  margin: ${rem(6)} 0;
`;

const Label = styled.label`
  ${labelBasic};
  display: block;
  margin-bottom: ${rem(4)};
  font-size: ${rem(18)};
`;

const Input = styled.input`
  ${inputBasic};
  width: 100%;
  display: block;

  font-size: ${rem(18)};
`;

const TextArea = styled.textarea`
  ${inputBasic};
  width: 100%;
  display: block;
  min-height: ${rem(80)};

  font-size: ${rem(18)};
`;

const CTARow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: ${rem(10)};
`;

const PrimaryButton = styled.button`
  ${buttonPrimary};
  ${buttonRounded};

  flex: 1;
  width: ${rem(150)};
  padding: ${rem(13)} ${rem(21)};
  font-size: ${rem(19)};
  font-weight: 500;

  margin-left: ${rem(30)};
  text-align: center;
`;

const CancelButton = styled.button`
  ${buttonWhite};
  ${buttonRounded};

  flex: 1;
  width: ${rem(150)};
  padding: ${rem(11)} ${rem(19)};
  font-size: ${rem(19)};
  font-weight: 500;
  text-align: center;
`;

const Error = styled.div`
  ${errorBasic};
`;

const TopBid = styled.div`
  margin-bottom: ${rem(5)};
  font-size: ${rem(18)};
  margin-bottom: ${rem(30)};
  text-align: center;

  p {
    display: inline-block;
    padding: ${rem(10)} ${rem(25)} ${rem(13)} ${rem(20)};
    margin: 0;

    ${box3DBorder};
  }
`;
