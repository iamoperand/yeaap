import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import {
  modalBasic,
  modalCentered,
  modalBorder,
  modalOverlay,
  modalHead,
  modalBody,
  modalFooter,
  modalCTARow,
  cancelButton,
  modalTitle,
  modalNote
} from '../../../styles/modal';

import rem from '../../../utils/rem';

import Bids from './bids';

const LiveBids = ({
  onClose,
  bids,
  creatorId,
  userId,
  winnerCount,
  auctionType
}) => {
  const isUserCreator = userId === creatorId;

  return (
    <ReactModal
      isOpen
      style={{ overlay: modalOverlay }}
      css={modalContent}
      onRequestClose={onClose}
    >
      <Head>
        <Title>Live bids</Title>
        <Note>You can see the top 20 bids until the bid is in progress.</Note>
      </Head>

      <Body>
        <Bids
          bids={bids}
          isUserCreator={isUserCreator}
          winnerCount={winnerCount}
          auctionType={auctionType}
        />
      </Body>

      <Footer>
        <CTARow>
          <Cancel onClick={onClose}>Close</Cancel>
        </CTARow>
      </Footer>
    </ReactModal>
  );
};

LiveBids.propTypes = {
  onClose: PropTypes.func.isRequired,
  bids: PropTypes.arrayOf(PropTypes.shape),
  creatorId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  winnerCount: PropTypes.number.isRequired,
  auctionType: PropTypes.oneOf(['HIGHEST_BID_WINS', 'CLOSEST_BID_WINS'])
};

export default LiveBids;

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
  padding: 0;
  max-height: ${rem(500)};
  overflow: auto;
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
