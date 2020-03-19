import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useToasts } from 'react-toast-notifications';
import { useForm } from 'react-hook-form';
import { get, isInteger, isEmpty } from 'lodash';
import formatNum from 'format-num';

import {
  modalBasic,
  modalCentered,
  modalBorder,
  modalOverlay,
  modalHead,
  modalBody,
  modalFooter,
  modalTitle,
  modalNote,
  modalCTARow,
  continueButton,
  cancelButton
} from '../../../styles/modal';
import { labelBasic, inputBasic } from '../../../styles/form';
import { errorBasic } from '../../../styles/form';

import rem from '../../../utils/rem';
import { getErrorMessage } from '../../../utils/error';

import TopBid from './top-bid';
import LoadingText from '../../loading-text';

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

  const [createBid, { loading: isCreatingBid }] = useMutation(CREATE_BID, {
    onError: (error) => {
      const errorMessage = getErrorMessage(error, "Bid couldn't be created");
      addToast(errorMessage, {
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

  const isCTADisabled = !isEmpty(errors) || isCreatingBid;

  return (
    <ReactModal
      style={{ overlay: modalOverlay }}
      css={modalContent}
      isOpen={true}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
    >
      <Head>
        <Title>Bid now!</Title>
        <Note>You are charged only if your bid succeeds.</Note>
      </Head>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Body>
          <TopBid amount={topBid} />

          <Field>
            <Label htmlFor="amount">Bid amount:</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="$100"
              ref={register(schema.amount(topBid))}
            />
            <Error>{get(errors, 'amount.message')}</Error>
          </Field>

          <Field>
            <Label htmlFor="message">Message:</Label>
            <TextArea
              id="message"
              name="message"
              placeholder="Any short message you'd like to add?"
              ref={register(schema.message)}
            />
            <Error>{get(errors, 'message.message')}</Error>
          </Field>
        </Body>

        <Footer>
          <CTARow>
            <Cancel type="button" onClick={onClose}>
              Cancel
            </Cancel>
            <Continue type="submit" disabled={isCTADisabled}>
              {!isCreatingBid ? (
                'Go ahead, bid'
              ) : (
                <LoadingText text="Bidding" />
              )}
            </Continue>
          </CTARow>
        </Footer>
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
`;

const Head = styled.div`
  ${modalHead};
`;

const Title = styled.div`
  ${modalTitle};
`;

const Note = styled.small`
  ${modalNote};
`;

const Body = styled.div`
  ${modalBody};
`;

const Footer = styled.div`
  ${modalFooter};
`;

const Label = styled.div`
  ${labelBasic};
  margin-bottom: ${rem(5)};
  font-size: ${rem(17)};
`;

const Field = styled.div`
  margin-top: ${rem(10)};
  :first-child {
    margin-top: 0;
  }
`;

const CTARow = styled.div`
  ${modalCTARow};
`;

const Continue = styled.button`
  ${continueButton};
`;

const Cancel = styled.button`
  ${cancelButton};
`;

const Input = styled.input`
  ${inputBasic};
  width: 100%;
  display: block;
`;

const TextArea = styled.textarea`
  ${inputBasic};
  width: 100%;
  display: block;
  min-height: ${rem(80)};
`;

const Error = styled.div`
  ${errorBasic};
`;
