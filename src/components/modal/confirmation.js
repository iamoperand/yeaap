import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import ReactModal from 'react-modal';

import rem from '../../utils/rem';
import { buttonPrimary, buttonWhite, buttonRounded } from '../../styles/button';
import {
  modalBasic,
  modalCentered,
  modalBorder,
  modalOverlay
} from '../../styles/modal';

const Confirmation = ({
  onClose,
  title,
  onContinue,
  onCancel,
  continueButtonLabel = 'Continue',
  cancelButtonLabel = 'Cancel',
  children
}) => {
  const handleCancel = () => {
    onCancel();
    onClose();
  };

  return (
    <ReactModal
      style={{ overlay: modalOverlay }}
      css={modalContent}
      isOpen={true}
      onRequestClose={handleCancel}
    >
      <Wrapper>
        <Head>
          <Title>{title}</Title>
        </Head>

        <Content>{children}</Content>

        <CTARow>
          <Cancel onClick={handleCancel}>{cancelButtonLabel}</Cancel>
          <Continue onClick={onContinue}>{continueButtonLabel}</Continue>
        </CTARow>
      </Wrapper>
    </ReactModal>
  );
};

Confirmation.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onContinue: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  continueButtonLabel: PropTypes.string,
  cancelButtonLabel: PropTypes.string,
  children: PropTypes.oneOf([PropTypes.element, PropTypes.node])
};

export default Confirmation;

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

const Wrapper = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 7px 14px 0 rgba(60, 66, 87, 0.12),
    0 3px 6px 0 rgba(0, 0, 0, 0.12);
`;

const Head = styled.div`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  padding: ${rem(16)} ${rem(20)};
  box-shadow: inset 0 -1px #e3e8ee;
`;
const Title = styled.div`
  font-size: ${rem(20)};
  font-weight: 500;
`;

const Content = styled.div`
  padding: ${rem(30)} ${rem(20)};
  box-shadow: inset 0 -1px #e3e8ee;
  background-color: #f7fafc;
`;

const CTARow = styled.div`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  padding: ${rem(16)} ${rem(20)};
  box-shadow: inset 0 1px #e3e8ee;

  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Cancel = styled.button`
  ${buttonWhite};
  ${buttonRounded};
  padding: ${rem(9)} ${rem(15)};
`;
const Continue = styled.button`
  ${buttonPrimary};
  ${buttonRounded};
  padding: ${rem(11)} ${rem(17)};
  margin-left: ${rem(5)};
`;
