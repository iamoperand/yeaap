import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import {
  modalBasic,
  modalCentered,
  modalPadding,
  modalBorder,
  modalOverlay
} from '../../styles/modal';
import { labelBasic, inputBasic } from '../../styles/form';
import { buttonPrimary, buttonWhite, buttonRounded } from '../../styles/button';

import rem from '../../utils/rem';

const PaymentDetailsModal = ({ onClose, onSubmit }) => (
  <ReactModal
    style={{ overlay: modalOverlay }}
    css={modalContent}
    isOpen={true}
    onRequestClose={onClose}
  >
    <Label htmlFor="amount">Enter your credit card:</Label>

    <Row>
      <Input id="card" type="text" placeholder="Credit card number" />
    </Row>

    <Row>
      <Input id="address" type="text" placeholder="Address line" />
    </Row>

    <Row>
      <Input id="cvv" type="number" placeholder="CVV" />
      <Input id="zip-code" type="text" placeholder="Zip code" />
    </Row>

    <CTARow>
      <CancelButton onClick={onClose}>Cancel</CancelButton>
      <PrimaryButton onClick={onSubmit}>Continue</PrimaryButton>
    </CTARow>

    <Note>You are charged only if your bid succeeds.</Note>
  </ReactModal>
);

PaymentDetailsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default PaymentDetailsModal;

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

  padding-bottom: ${rem(20)};
`;

const Label = styled.label`
  ${labelBasic};
  display: block;
`;

const Input = styled.input`
  ${inputBasic};
  flex: 1;
  display: block;

  font-size: ${rem(18)};
`;

const Row = styled.div`
  display: flex;

  margin-top: ${rem(10)};
  :first-child {
    margin-top: ${rem(20)};
  }

  input:nth-child(2) {
    margin-left: ${rem(30)};
  }
`;

const CTARow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: ${rem(20)};
`;

const PrimaryButton = styled.button`
  ${buttonPrimary};
  ${buttonRounded};

  flex: 1;
  width: ${rem(120)};
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
  width: ${rem(120)};
  padding: ${rem(11)} ${rem(19)};
  font-size: ${rem(19)};
  font-weight: 500;
  text-align: center;
`;

const Note = styled.div`
  margin-top: ${rem(20)};
  font-weight: 500;
`;
