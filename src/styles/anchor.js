import { css } from '@emotion/core';

export const anchorFeedback = css`
  transition: all 0.15s ease-in-out;
  :hover {
    transform: scale(1.05);
  }
  :active {
    transform: scale(0.95);
  }
`;
