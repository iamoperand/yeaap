import { css } from '@emotion/core';

import rem from '../utils/rem';
import theme from '../utils/theme';

export const labelBasic = css`
  color: #212e3a;
  font-size: ${rem(20)};
  font-weight: 500;
  user-select: none;
`;

export const inputBasic = css`
  ::placeholder {
    color: #ccc;
  }
  border: 2px solid #ccc;
  border-radius: ${rem(5)};
  padding: ${rem(10)};
`;

export const errorBasic = css`
  color: ${theme.colors.error};
  margin-top: ${rem(2)};
  min-height: ${rem(16)};
  font-size: ${rem(14)};
`;
