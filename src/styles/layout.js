import { css } from '@emotion/core';

import rem from '../utils/rem';
import theme from '../utils/theme';

export const bodyStyles = css`
  width: 100%;
  height: 100%;
`;

export const centerStyles = css`
  margin: 0 auto;
  padding: 0 ${rem(32)};
  min-height: 100vh;
  width: 100vw;

  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    max-width: ${rem(830)};
  }
`;
