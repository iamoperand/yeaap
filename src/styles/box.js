import { css } from '@emotion/core';

export const boxBorder = css`
  border: 2px solid rgba(120, 129, 136, 0.5);
`;

export const box3DBorder = css`
  background-color: transparent;
  border-radius: 3px;
  box-sizing: border-box;
  position: relative;
  top: -2px;
  left: -2px;
  transition: transform 0.2s;
  z-index: 0;

  :before {
    content: '';
    background: #fff;
    border: 3px solid #222;
    border-radius: 3px;
    position: absolute;
    top: -3px;
    left: -3px;
    height: 100%;
    width: 100%;
    z-index: -1;
  }

  :after {
    content: '';
    display: block;
    background: #828181;
    border: 3px solid #222;
    border-radius: 3px;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 3px;
    left: 3px;
    right: 0;
    z-index: -2;
    transition: transform 0.2s;
  }
`;
