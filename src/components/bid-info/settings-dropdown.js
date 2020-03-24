import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import rem from '../../utils/rem';
import theme from '../../utils/theme';

const SettingsDropdown = ({ isOpen, onEditAuction, onCancelAuction }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <DropdownWrapper>
      <List>
        <Item onClick={onEditAuction}>Edit auction</Item>
        <Item onClick={onCancelAuction}>Cancel auction</Item>
      </List>
    </DropdownWrapper>
  );
};

SettingsDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onEditAuction: PropTypes.func.isRequired,
  onCancelAuction: PropTypes.func.isRequired
};

export default SettingsDropdown;

/*
 ********************************************
 styled components
 ********************************************
 */

const DropdownWrapper = styled.div`
  position: absolute;

  left: 18px;
  right: inherit;
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    left: inherit;
    right: 18px;
  }
  top: 20px;
  z-index: 10;
  background-color: #fff;
  box-shadow: 0 0 0 1px rgba(136, 152, 170, 0.1),
    0 15px 35px 0 rgba(49, 49, 93, 0.1), 0 5px 15px 0 rgba(0, 0, 0, 0.08);

  white-space: nowrap;
  text-align: left;
  border-radius: 4px;
`;

const List = styled.div`
  padding: ${rem(8)} 0;
`;

const Item = styled.div`
  padding: ${rem(5)} ${rem(20)} ${rem(5)} ${rem(10)};
  color: ${theme.colors.primary};
  cursor: pointer;

  :hover {
    background-color: #f7fafc;
    color: #1a1f36;
  }
`;
