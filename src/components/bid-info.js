import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { useModal } from 'react-modal-hook';
import { isEmpty } from 'lodash';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useToasts } from 'react-toast-notifications';
import { useRouter } from 'next/router';

import rem from '../utils/rem';
import theme from '../utils/theme';
import { getErrorMessage } from '../utils/error';

import { boxBorder } from '../styles/box';
import { buttonPrimary, buttonRounded, buttonDisabled } from '../styles/button';

import CrossIcon from '../assets/icons/cross.svg?sprite';
import ShareIcon from '../assets/icons/share.svg?sprite';

import BidModal from './modal/bid';
import AuthModal from './modal/auth';
import PaymentMethodModal from './modal/payment-method';
import ConfirmationModal from './modal/confirmation';
import {
  BidsHiddenTag,
  BidsVisibleTag,
  ClosestBidWinsTag,
  HighestBidWinsTag
} from './tags';

import useSession from '../hooks/use-session';

const CANCEL_AUCTION = gql`
  mutation cancelAuction($where: AuctionWhereInput!) {
    cancelAuction(where: $where) {
      id
    }
  }
`;

// eslint-disable-next-line max-lines-per-function
const BidInfo = ({
  name,
  description,
  isLeaderboardLoading,
  auctionId,
  topBid,
  auctionType,
  hasBidsVisible,
  isCancelled
}) => {
  const { user, isUserLoading } = useSession();

  const [showAuthModal, hideAuthModal] = useModal(() => (
    <AuthModal onClose={hideAuthModal} />
  ));
  const [showPaymentMethodModal, hidePaymentMethodModal] = useModal(
    () => <PaymentMethodModal onClose={hidePaymentMethodModal} user={user} />,
    [user]
  );
  const [showBidModal, hideBidModal] = useModal(
    () => (
      <BidModal onClose={hideBidModal} auctionId={auctionId} topBid={topBid} />
    ),
    [auctionId, topBid]
  );

  const { addToast } = useToasts();
  const router = useRouter();

  const [cancelAuction] = useMutation(CANCEL_AUCTION, {
    onError: (error) => {
      const errorMessage = getErrorMessage(
        error,
        'An error occurred while cancelling the auction'
      );
      addToast(errorMessage, {
        appearance: 'error'
      });
      hideCancelConfirmation();
    },
    onCompleted: () => {
      addToast(`The auction has been cancelled`, {
        appearance: 'success',
        autoDismiss: true,
        autoDismissTimeout: 3000,
        onDismiss: router.reload
      });
      hideCancelConfirmation();
    }
  });

  const cancelHandler = () => {
    cancelAuction({
      variables: {
        where: {
          auctionId
        }
      }
    });
  };

  const [showCancelConfirmation, hideCancelConfirmation] = useModal(() => (
    <ConfirmationModal
      onClose={hideCancelConfirmation}
      title="Cancel auction?"
      onContinue={cancelHandler}
      onCancel={hideCancelConfirmation}
      continueButtonLabel={'Cancel it!'}
      cancelButtonLabel={'Close'}
    >
      <div>Are you sure you want to cancel the auction?</div>
    </ConfirmationModal>
  ));

  // handler responsible for bidding
  const bidHandler = () => {
    // check if the auction is cancelled or settled
    if (isCancelled) {
      addToast('This auction has been cancelled by the owner', {
        appearance: 'info'
      });
      return;
    }

    // check if the user is authenticated
    if (isEmpty(user)) {
      showAuthModal();
      return;
    }

    // check if user has an active payment method
    if (isEmpty(user.paymentMethods)) {
      showPaymentMethodModal();
      return;
    }

    showBidModal();
  };

  const isHighestBidWinner = auctionType === 'HIGHEST_BID_WINS';
  const isAuctionActive = !isCancelled;

  return (
    <Box>
      <RowWrapper>
        <Row>
          <Label>Auction by</Label>
          <Name>{name}</Name>
        </Row>
        <Row>
          {isHighestBidWinner ? <HighestBidWinsTag /> : <ClosestBidWinsTag />}
          &nbsp;{hasBidsVisible ? <BidsVisibleTag /> : <BidsHiddenTag />}
        </Row>
      </RowWrapper>
      <Row>
        <Italic>{description}</Italic>
      </Row>

      <CTARowWrapper>
        {isAuctionActive && (
          <CTARow>
            <IconButton type="danger" onClick={showCancelConfirmation}>
              <CrossIcon
                css={css`
                  color: #e8833a;
                  height: 20px;
                `}
              />
            </IconButton>
            {/* disable the button until user is fetched, to check if user has payment methods or not */}
            <Button
              onClick={bidHandler}
              disabled={isUserLoading || isLeaderboardLoading}
            >
              Bid
            </Button>
            <IconButton type="success">
              <ShareIcon
                css={css`
                  color: #1aae9f;
                  height: 20px;
                `}
              />
            </IconButton>
          </CTARow>
        )}
      </CTARowWrapper>
    </Box>
  );
};

BidInfo.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isLeaderboardLoading: PropTypes.bool.isRequired,
  auctionId: PropTypes.string.isRequired,
  topBid: PropTypes.number.isRequired,
  auctionType: PropTypes.oneOf(['HIGHEST_BID_WINS', 'CLOSEST_BID_WINS'])
    .isRequired,
  hasBidsVisible: PropTypes.bool.isRequired,
  isCancelled: PropTypes.bool.isRequired
};

export default BidInfo;

/*
 ********************************************
 styled components
 ********************************************
 */

const Box = styled.div`
  ${boxBorder};
  background-color: #f7f9fa;
  padding: ${rem(12)} ${rem(12)} ${rem(40)};
`;

const RowWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Row = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: flex-start;

  padding: ${rem(5)} 0;
`;

const Name = styled.div`
  font-size: ${rem(24)};
  color: #293845;
  font-weight: bold;

  margin-left: ${rem(10)};
`;

const CTARowWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const CTARow = styled.div`
  position: absolute;
  bottom: ${rem(-70)};

  display: flex;
  align-items: center;
`;

const Button = styled.button`
  padding: ${rem(15)} ${rem(65)};
  font-size: ${rem(22)};
  font-weight: 500;
  margin: 0 ${rem(20)};

  ${buttonPrimary};
  ${buttonRounded};
  ${buttonDisabled};
`;

const IconButton = styled.button`
  padding: ${rem(10)};
  background: #fff;
  border: 3px solid
    ${({ type }) =>
      type === 'success' ? '#a7ded9' : type === 'danger' ? '#f7d2b8' : '#ccc'};

  ${buttonRounded};
`;

const Italic = styled.span`
  font-style: italic;
`;

const Label = styled.span`
  color: ${theme.colors.label};
`;
