import { css } from '@emotion/core';

import rem from '../utils/rem';
import theme from '../utils/theme';

export const buttonPrimary = css`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.text};
`;

export const buttonWhite = css`
  background-color: ${theme.colors.text};
  color: ${theme.colors.primary};
  border: 2px solid #c7c3fb;
`;

export const buttonRounded = css`
  border-radius: ${rem(5)};
`;

export const buttonCTAPadding = css`
  padding: ${rem(11)} ${rem(19)};
`;

export const buttonDisabled = css`
  :disabled {
    background-color: ${theme.colors.disabledButton};
    cursor: not-allowed;
  }
`;

export const buttonFeedback = css`
  transition: all 0.15s ease-in-out;
  text-align: center;
  :hover {
    transform: translateY(-1px);
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
  }
  :active {
    transform: translateY(1px);
    box-shadow: 0 6px 12px -2px rgba(50, 50, 93, 0.25),
      0 3px 7px -3px rgba(0, 0, 0, 0.3);
  }
  :disabled:hover,
  :disabled:active {
    transform: none;
    box-shadow: none;
  }
`;
