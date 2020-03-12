import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Link from 'next/link';
import { get } from 'lodash';
import { useToasts } from 'react-toast-notifications';
import { useModal } from 'react-modal-hook';

import rem from '../utils/rem';
import theme from '../utils/theme';
import Avatar from './avatar';
import useSession from '../hooks/use-session';
import useDropdown from '../hooks/use-dropdown';
import { auth } from '../utils/firebase';

import AuthModal from './modal/auth';

const Dropdown = ({ isOpen, isLoggedIn, name }) => {
  const { addToast } = useToasts();
  const [showAuthModal, hideAuthModal] = useModal(() => (
    <AuthModal onClose={hideAuthModal} />
  ));

  if (!isOpen) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <DropdownWrapper>
        <List>
          <NormalItem onClick={showAuthModal}>Login</NormalItem>
        </List>
      </DropdownWrapper>
    );
  }

  const logout = () =>
    auth
      .signOut()
      .then(() =>
        addToast('Logged out!', {
          appearance: 'success',
          autoDismiss: true
        })
      )
      .catch(() =>
        addToast(`Couldn't log you out!`, {
          appearance: 'error'
        })
      );

  return (
    <DropdownWrapper>
      <Name>{name}</Name>
      <List>
        <Link href="/account" passHref>
          <StyledLink>Account</StyledLink>
        </Link>

        <NormalItem onClick={logout}>Logout</NormalItem>
      </List>
    </DropdownWrapper>
  );
};

Dropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  name: PropTypes.string
};

const Header = () => {
  const { user, isUserLoading } = useSession();

  const { ref, isOpen, open, close } = useDropdown();

  const toggle = isOpen ? close : open;

  const isLoggedIn = !!user;

  return (
    <Wrapper>
      <Link href="/" passHref>
        <Title>yeaap.co</Title>
      </Link>

      <AvatarWrapper ref={ref} onClick={toggle}>
        {!isUserLoading && (
          <Avatar src={get(user, 'photoUrl')} alt={get(user, 'name')} />
        )}

        <Dropdown
          isOpen={isOpen}
          isLoggedIn={isLoggedIn}
          name={get(user, 'name')}
        />
      </AvatarWrapper>
    </Wrapper>
  );
};

export default Header;

/*
 ********************************************
 styled components
 ********************************************
 */

const Wrapper = styled.div`
  margin-top: ${rem(20)};

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.a`
  font-size: ${rem(24)};

  ::after {
    border-color: ${theme.colors.links};
  }
`;

const AvatarWrapper = styled.div`
  height: ${rem(30)};
  width: ${rem(30)};
  border-radius: 50%;
  background-color: transparent;

  img {
    z-index: 2;
    cursor: pointer;
    border-radius: 50%;
    width: 100%;
    height: 100%;

    box-shadow: rgba(60, 66, 87, 0.12) 0px 7px 14px 0px,
      rgba(0, 0, 0, 0.12) 0px 3px 6px 0px;
  }

  position: relative;
`;

const DropdownWrapper = styled.div`
  position: absolute;
  right: 0px;
  z-index: 10;
  background-color: #fff;
  box-shadow: 0 0 0 1px rgba(136, 152, 170, 0.1),
    0 15px 35px 0 rgba(49, 49, 93, 0.1), 0 5px 15px 0 rgba(0, 0, 0, 0.08);

  min-width: ${rem(200)};
`;

const Name = styled.div`
  padding: ${rem(12)};
  box-shadow: inset 0 -1px #e3e8ee;
`;

const List = styled.div`
  padding: ${rem(8)} 0;
`;

const itemStyles = css`
  padding: ${rem(4)} ${rem(12)};
  color: ${theme.colors.links};
  cursor: pointer;

  :hover {
    background-color: #f7fafc;
    color: #1a1f36;
  }
`;

const StyledLink = styled.a`
  ${itemStyles};
  display: block;
  :after {
    border: none;
  }
`;

const NormalItem = styled.div`
  ${itemStyles};
`;
