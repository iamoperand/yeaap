import { css } from '@emotion/core';

import rem from '../utils/rem';

export const labelBasic = css`
  color: #212e3a;
  font-size: ${rem(20)};
  font-weight: 500;
`;

export const inputBasic = css`
  :placeholder {
    color: #ccc;
  }
  border: 2px solid #ccc;
  border-radius: ${rem(5)};
  padding: ${rem(10)} ${rem(5)};
`;
