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
