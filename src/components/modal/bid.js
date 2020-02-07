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

const BidModal = ({ onClose, onSubmit }) => (
  <ReactModal
    style={{ overlay: modalOverlay }}
    css={modalContent}
    isOpen={true}
    onRequestClose={onClose}
  >
    <Label htmlFor="amount">Bid amount:</Label>
    <Input id="amount" type="number" placeholder="$137" />

    <CTARow>
      <CancelButton onClick={onClose}>Cancel</CancelButton>
      <PrimaryButton onClick={onSubmit}>Bid</PrimaryButton>
    </CTARow>
  </ReactModal>
);

BidModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default BidModal;

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

const Label = styled.label`
  ${labelBasic};
  display: block;
  margin-bottom: ${rem(20)};
`;

const Input = styled.input`
  ${inputBasic};
  width: 100%;
  display: block;

  font-size: ${rem(18)};
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
