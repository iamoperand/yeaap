import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { useModal } from 'react-modal-hook';
import { isEmpty } from 'lodash';

import rem from '../utils/rem';
import theme from '../utils/theme';

import { boxBorder } from '../styles/box';
import { buttonPrimary, buttonRounded, buttonDisabled } from '../styles/button';

import CrossIcon from '../assets/icons/cross.svg?sprite';
import ShareIcon from '../assets/icons/share.svg?sprite';

import BidModal from '../components/modal/bid';
import AuthModal from '../components/modal/auth';
import PaymentMethodModal from '../components/modal/payment-method';
import useSession from '../hooks/use-session';
import useAuction from '../hooks/use-auction';

const BidInfo = ({ name, description, isLeaderboardLoading }) => {
  const { user, isUserLoading } = useSession();
  const { id: auctionId, topBid } = useAuction();

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

  // handler responsible for bidding
  const bidHandler = () => {
    // check if the user is authenticated
    if (isEmpty(user)) {
      console.log('user is not authenticated');
      showAuthModal();
      return;
    }

    // check if user has an active payment method
    if (isEmpty(user.paymentMethods)) {
      showPaymentMethodModal();
      return;
    }

    console.log('user is authenticated and has payment method, yay!');
    showBidModal();
  };

  return (
    <Box>
      <Row>
        <Label>Bid by</Label>
        <Name>{name}</Name>
      </Row>
      <Row>
        <Italic>{description}</Italic>
      </Row>

      <CTARowWrapper>
        <CTARow>
          <IconButton type="danger">
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
      </CTARowWrapper>
    </Box>
  );
};

BidInfo.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isLeaderboardLoading: PropTypes.bool.isRequired
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
