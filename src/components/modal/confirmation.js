import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import ReactModal from 'react-modal';
import { noop } from 'lodash';

import rem from '../../utils/rem';
import {
  modalBasic,
  modalCentered,
  modalBorder,
  modalOverlay,
  modalHead,
  modalBody,
  modalFooter,
  modalTitle,
  modalCTARow,
  continueButton,
  cancelButton
} from '../../styles/modal';

import LoadingText from '../loading-text';

const Confirmation = ({
  onClose,
  title,
  onContinue,
  onCancel = noop,
  continueButtonLabel = 'Continue',
  cancelButtonLabel = 'Cancel',
  isSubmitting,
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
      shouldCloseOnOverlayClick={false}
    >
      <Wrapper>
        <Head>
          <Title>{title}</Title>
        </Head>

        <Content>{children}</Content>

        <Footer>
          <CTARow>
            <Cancel onClick={handleCancel}>{cancelButtonLabel}</Cancel>
            <Continue onClick={onContinue} disabled={isSubmitting}>
              {!isSubmitting ? (
                continueButtonLabel
              ) : (
                <LoadingText text="Submitting" />
              )}
            </Continue>
          </CTARow>
        </Footer>
      </Wrapper>
    </ReactModal>
  );
};

Confirmation.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onContinue: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  continueButtonLabel: PropTypes.string,
  cancelButtonLabel: PropTypes.string,
  isSubmitting: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.node])
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
  width: ${rem(500)};
`;

const Wrapper = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 7px 14px 0 rgba(60, 66, 87, 0.12),
    0 3px 6px 0 rgba(0, 0, 0, 0.12);
`;

const Head = styled.div`
  ${modalHead};
`;
const Title = styled.div`
  ${modalTitle};
`;

const Content = styled.div`
  ${modalBody};
  padding: ${rem(25)} ${rem(30)};
`;

const Footer = styled.div`
  ${modalFooter};
`;

const CTARow = styled.div`
  ${modalCTARow};
`;

const Cancel = styled.button`
  ${cancelButton};
`;

const Continue = styled.button`
  ${continueButton};
`;
