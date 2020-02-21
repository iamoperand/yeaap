import { css } from '@emotion/core';

import rem from '../utils/rem';
import theme from '../utils/theme';

export const bodyStyles = css`
  width: 100%;
  height: 100%;
`;

export const centerStyles = css`
  max-width: ${rem(700)};
  width: calc(100% - ${rem(30)});
  margin: 0 auto;

  @media (min-width: ${theme.breakpoints.xs}) {
    width: calc(100% - ${rem(350)});
  }

  min-height: 100vh;
`;
