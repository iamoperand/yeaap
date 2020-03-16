import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import rem from '../utils/rem';

import LeftArrowIcon from '../assets/icons/arrow-left.svg?sprite';
import RightArrowIcon from '../assets/icons/arrow-right.svg?sprite';

const Pagination = ({
  onNext,
  onPrev,
  currentPage,
  totalPages,
  isFetchingData
}) => {
  const isBackButtonDisabled = isFetchingData || currentPage <= 0;
  const isNextButtonDisabled = isFetchingData || currentPage >= totalPages;

  return (
    <Wrapper>
      <BackButton onClick={onPrev} disabled={isBackButtonDisabled}>
        <LeftArrowIcon
          css={css`
            width: ${rem(15)};
            height: ${rem(15)};
            position: relative;
            top: -2px;
          `}
        />
        &nbsp;Previous
      </BackButton>
      <Content>
        You are on page {currentPage} of {totalPages}
      </Content>
      <NextButton onClick={onNext} disabled={isNextButtonDisabled}>
        Next, please&nbsp;
        <RightArrowIcon
          css={css`
            width: ${rem(15)};
            height: ${rem(15)};
            position: relative;
            top: -2px;
          `}
        />
      </NextButton>
    </Wrapper>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  isFetchingData: PropTypes.bool.isRequired
};

export default Pagination;

/*
 ********************************************
 styled components
 ********************************************
 */

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: ${rem(5)};
  background-color: rgba(120, 129, 136, 0.5);
`;

const Content = styled.div`
  background-color: white;
  padding: ${rem(10)} ${rem(20)};
  transform: rotate(-2deg);
  font-size: ${rem(20)};
`;

const buttonStyles = css`
  background-color: white;
  display: flex;
  align-items: center;
  font-size: ${rem(18)};
  padding: ${rem(5)} ${rem(20)};

  :disabled {
    cursor: not-allowed;
  }
`;

const NextButton = styled.button`
  ${buttonStyles};
  transform: rotate(-2deg);
`;

const BackButton = styled.button`
  ${buttonStyles};
  transform: rotate(2deg);
`;
