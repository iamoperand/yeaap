import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import rem from '../../utils/rem';
import theme from '../../utils/theme';

const Message = ({ isOpen, message }) => {
  return (
    <Wrapper isOpen={isOpen}>
      <Text>{`"${message}"`}</Text>
    </Wrapper>
  );
};

Message.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired
};

export default Message;

/*
 ********************************************
 styled components
 ********************************************
 */

const Wrapper = styled.div`
  display: ${(props) => (!props.isOpen ? 'none' : 'flex')};
  padding-bottom: ${rem(25)};
  justify-content: flex-end;
  position: relative;
  top: 2px;
`;

const Text = styled.div`
  width: 50%;
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    width: ${rem(400)};
  }
  color: #4c4c4c;
  white-space: normal;
  background-color: #fff;
  border-radius: 4px;
  padding: ${rem(15)} ${rem(20)};
  box-shadow: rgba(60, 66, 87, 0.12) 0px 7px 14px 0px,
    rgba(0, 0, 0, 0.12) 0px 3px 6px 0px;

  position: relative;
  :after {
    content: '';
    position: absolute;
    top: 0;
    right: 2px;
    width: 0;
    height: 0;
    border: 17px solid transparent;
    border-bottom-color: #fff;
    border-top: 0;
    margin-left: -10px;
    margin-top: -10px;
  }
`;
