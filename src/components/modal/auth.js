import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import {
  modalBasic,
  modalBorder,
  modalCentered,
  modalOverlay,
  modalPadding
} from '../../styles/modal';
import { labelBasic } from '../../styles/form';
import { buttonRounded, buttonWhite } from '../../styles/button';

import rem from '../../utils/rem';

const AuthModal = ({ onClose }) => {
  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      style={{ overlay: modalOverlay }}
      css={modalContent}
    >
      <Label>Continue with:</Label>

      <CTAWrapper>
        <NormalButton>Google</NormalButton>
        <NormalButton>Facebook</NormalButton>
        <NormalButton>Twitter</NormalButton>
      </CTAWrapper>
    </ReactModal>
  );
};

AuthModal.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default AuthModal;

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
`;

const NormalButton = styled.button`
  ${buttonRounded};
  ${buttonWhite};

  padding: ${rem(10)} ${rem(50)};

  margin-top: ${rem(10)};
  :first-child {
    margin-top: ${rem(20)};
  }
`;

const CTAWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
