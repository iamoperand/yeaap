import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { noop } from 'lodash';

import theme from '../utils/theme';

const Toggle = ({ name, onClick, isOn }) => {
  return (
    <label htmlFor={name}>
      <HiddenInput
        type="checkbox"
        id={name}
        name={name}
        checked={isOn}
        onClick={onClick}
        onChange={noop}
      />
      <Switch />
    </label>
  );
};

Toggle.propTypes = {
  name: PropTypes.string.isRequired,
  isOn: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Toggle;

/*
 ********************************************
 styled components
 ********************************************
 */

const Switch = styled.div`
  box-sizing: initial;
  display: inline-block;
  outline: 0;
  width: 2em;
  height: 1em;
  position: relative;
  cursor: pointer;
  user-select: none;
  background: #fbfbfb;
  border-radius: 4em;
  padding: 4px;
  transition: all 0.4s ease;
  border: 2px solid #e8eae9;

  ::after,
  :active::after {
    box-sizing: initial;
  }

  :after {
    left: 0;
    position: relative;
    display: block;
    content: '';
    width: 50%;
    height: 100%;
    border-radius: 4em;
    background: #fbfbfb;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
      padding 0.3s ease, margin 0.3s ease;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08);
  }
  :active::after {
    padding-right: 0.2em;
  }
`;

const HiddenInput = styled.input`
  /* visually hidden but still accessible */
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;

  :checked ~ ${Switch}::after {
    left: 50%;
  }
  :checked ~ ${Switch}:active {
    box-shadow: none;
  }

  :checked ~ ${Switch}:active:after {
    margin-left: -0.2em;
  }
  :checked ~ ${Switch} {
    background: ${theme.colors.links};
  }
`;
