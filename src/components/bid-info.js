import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { useModal } from 'react-modal-hook';

import rem from '../utils/rem';
import theme from '../utils/theme';

import { boxBorder } from '../styles/box';
import { buttonPrimary, buttonRounded } from '../styles/button';

import CrossIcon from '../assets/icons/cross.svg?sprite';
import ShareIcon from '../assets/icons/share.svg?sprite';

import BidModal from '../components/modal/bid';

const BidInfo = ({ name, description }) => {
  function handleBidSubmit() {
    console.log('Woohoo!');
  }

  const [showModal, hideModal] = useModal(() => (
    <BidModal onClose={hideModal} onSubmit={handleBidSubmit} />
  ));

  return (
    <Box>
      <Row>
        <span
          css={css`
            color: ${theme.colors.label};
          `}
        >
          Bid by
        </span>
        <Name>{name}</Name>
      </Row>
      <Row>
        <span
          css={css`
            font-style: italic;
          `}
        >
          {description}
        </span>
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
          <Button onClick={showModal}>Bid</Button>
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
  description: PropTypes.string.isRequired
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
`;

const IconButton = styled.button`
  padding: ${rem(10)};
  background: #fff;
  border: 3px solid
    ${({ type }) =>
      type === 'success' ? '#a7ded9' : type === 'danger' ? '#f7d2b8' : '#ccc'};

  ${buttonRounded};
`;
