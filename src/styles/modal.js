import { css } from '@emotion/core';

import rem from '../utils/rem';

export const modalOverlay = {
  backgroundColor: 'rgba(0, 0, 0, 0.7)'
};

export const modalBasic = css`
  outline: none;
  background: #fff;
  border-radius: ${rem(5)};
  min-width: ${rem(400)};
`;

export const modalCentered = css`
  position: absolute;
  left: 50%;
  top: 48%;
  transform: translate(-50%, -50%);
`;

export const modalBorder = css`
  border: 2px solid #ccc;
`;

export const modalPadding = css`
  padding: ${rem(40)};
`;
