import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import rem from '../utils/rem';
import CheckCircleIcon from '../assets/icons/check-circle.svg';

const AuctionType = React.forwardRef(
  ({ name, value, id, defaultChecked = false, children }, ref) => {
    return (
      <Card>
        <Input
          type="radio"
          name={name}
          value={value}
          id={id}
          ref={ref}
          defaultChecked={defaultChecked}
        />
        <label htmlFor={id}>
          <Content>{children}</Content>
        </label>
      </Card>
    );
  }
);

AuctionType.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  defaultChecked: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.node])
};

export default AuctionType;

/*
 ********************************************
 styled components
 ********************************************
 */

const Card = styled.div`
  text-align: center;
  position: relative;
  border-radius: 4px;
  width: ${rem(200)};

  margin: 0 ${rem(10)};
  :first-child {
    margin-left: 0;
  }
  :last-child {
    margin-right: 0;
  }
`;

const Content = styled.div`
  padding: ${rem(30)};
  height: 100%;
  width: 100%;
  border-radius: 4px;

  user-select: none;
  cursor: pointer;

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

const Input = styled.input`
  display: none;

  :checked ~ label:after {
    position: absolute;
    content: url(${CheckCircleIcon});
    background: white;
    left: -12px;
    right: auto;
    top: -12px;
    width: ${rem(40)};
    height: ${rem(40)};
  }

  :checked ~ label ${Content} {
  }
  :checked ~ label ${Content}:after {
    background: #111;
  }
`;
