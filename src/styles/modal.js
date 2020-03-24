import { css } from '@emotion/core';

import rem from '../utils/rem';
import theme from '../utils/theme';
import {
  buttonWhite,
  buttonPrimary,
  buttonRounded,
  buttonDisabled
} from './button';

export const modalOverlay = {
  backgroundColor: 'rgba(0, 0, 0, 0.7)'
};

export const modalBasic = css`
  outline: none;
  background: #fff;
  border-radius: ${rem(5)};

  max-width: 95%;
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    min-width: ${rem(400)};
  }
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

export const modalHead = css`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  padding: ${rem(20)} ${rem(15)};
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    padding: ${rem(20)} ${rem(30)};
  }
  box-shadow: inset 0 -1px #e3e8ee;
`;

export const modalTitle = css`
  font-size: ${rem(20)};
  font-weight: 500;
`;

export const modalNote = css`
  color: #656565;
`;

export const modalBody = css`
  padding: ${rem(20)} ${rem(15)};
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    padding: ${rem(22)} ${rem(30)} ${rem(18)};
  }

  box-shadow: inset 0 -1px #e3e8ee;
  background-color: #f7fafc;
`;

export const modalFooter = css`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  padding: ${rem(20)} ${rem(15)};
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    padding: ${rem(20)} ${rem(20)};
  }
  box-shadow: inset 0 1px #e3e8ee;
`;

export const modalCTARow = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: ${rem(17)};
`;

export const continueButton = css`
  ${buttonPrimary};
  ${buttonRounded};
  ${buttonDisabled};

  padding: ${rem(11)} ${rem(17)};
  margin-left: ${rem(5)};
`;

export const cancelButton = css`
  ${buttonWhite};
  ${buttonRounded};
  ${buttonDisabled};

  padding: ${rem(9)} ${rem(15)};
`;
