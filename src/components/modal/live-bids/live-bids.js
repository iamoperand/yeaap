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
  modalTitle
} from '../../../styles/modal';

import rem from '../../../utils/rem';
import theme from '../../../utils/theme';

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
        <Title>Bids leaderboard</Title>
        <CountLabel>Top 20</CountLabel>
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
  min-width: 0;
`;

const Head = styled.div`
  ${modalHead};

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: ${rem(30)};
  padding-right: ${rem(30)};
`;

const Title = styled.div`
  ${modalTitle};
  font-size: ${rem(25)};
  font-weight: 400;
`;

const CountLabel = styled.div`
  padding: ${rem(10)} ${rem(20)};
  border-radius: ${rem(30)};
  border: 2px solid #c7c3fb;
  background: none;

  color: ${theme.colors.primary};
`;

const Body = styled.div`
  ${modalBody};

  padding: ${rem(30)} ${rem(50)};
`;

const Footer = styled.div`
  ${modalFooter};
  padding-left: ${rem(30)};
  padding-right: ${rem(30)};
`;

const CTARow = styled.div`
  ${modalCTARow};
`;

const Cancel = styled.button`
  ${cancelButton};
  padding: ${rem(9)} ${rem(25)};
`;
