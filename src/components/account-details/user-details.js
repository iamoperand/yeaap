import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { map, includes } from 'lodash';
import { useToasts } from 'react-toast-notifications';

import Avatar from '../avatar';

import { auth } from '../../utils/firebase';
import { providerCollection } from '../../utils/auth';
import rem from '../../utils/rem';

const UserDetails = ({ user }) => {
  const { addToast } = useToasts();
  const firestoreUser = auth.currentUser;

  const handleProviderClick = ({ isLinked, label, provider }) => {
    if (isLinked) {
      addToast(`${label} is already linked to your account`, {
        appearance: 'info',
        autoDismiss: true
      });
      return;
    }

    firestoreUser
      .linkWithPopup(provider)
      .then(() => {
        addToast(`${label} is now linked to your account`, {
          appearance: 'success',
          autoDismiss: true
        });
      })
      .catch(() => {
        addToast(`Couldn't link ${label} to your account`, {
          appearance: 'error'
        });
      });
  };

  const linkedProviderIds =
    firestoreUser &&
    map(firestoreUser.providerData, (profile) => profile.providerId);

  const providers = map(providerCollection, (provider, providerId) => ({
    ...provider,
    isLinked: includes(linkedProviderIds, providerId)
  }));

  return (
    <>
      <UserInfoRow>
        <Avatar src={user.photoUrl} alt={user.name} />
        <Name>{user.name}</Name>
        <Label>{user.auctionCount} Auctions</Label>
        <Label>{user.bidCount} Bids</Label>
      </UserInfoRow>
      <ProviderRow>
        {map(providers, (provider) => (
          <Provider
            key={provider.label}
            type={provider.label}
            onClick={handleProviderClick.bind(null, provider)}
          >
            <ProviderText>
              {provider.isLinked ? provider.label : `Link ${provider.label}`}
            </ProviderText>
          </Provider>
        ))}
      </ProviderRow>
    </>
  );
};

UserDetails.propTypes = {
  user: PropTypes.shape({
    photoUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    auctionCount: PropTypes.number.isRequired,
    bidCount: PropTypes.number.isRequired
  }).isRequired
};

export default UserDetails;

/*
 ********************************************
 styled components
 ********************************************
 */

const UserInfoRow = styled.div`
  display: flex;
  align-items: center;

  img {
    height: ${rem(35)};
    width: ${rem(35)};
    border-radius: 50%;
  }
`;

const Name = styled.div`
  font-size: ${rem(18)};
  margin: 0 ${rem(8)};
  position: relative;
  top: -1px;
`;

const Label = styled.div`
  font-size: ${rem(15)};
  color: #6d7b86;
  margin: 0 ${rem(4)};
`;

const ProviderRow = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${rem(43)};
`;

const getColor = (type) => {
  switch (type) {
    case 'Google': {
      return {
        border: '#dd4b39',
        background: '#dd4b39c7'
      };
    }
    case 'Facebook': {
      return {
        border: '#4c69ba',
        background: '#4c69bac7'
      };
    }
    case 'Twitter': {
      return {
        border: '#00acee',
        background: '#00aceec7'
      };
    }
    default: {
      return {
        border: '#000',
        background: '#000'
      };
    }
  }
};

const Provider = styled.button`
  font-size: ${rem(14)};
  padding: ${rem(4)} ${rem(4)};
  border: ${(props) => `2px solid ${getColor(props.type).border}`};
  background-color: ${(props) => getColor(props.type).background};
  color: #fff;
  margin: 0 ${rem(5)};
  :first-child {
    margin-left: 0;
  }
`;

const ProviderText = styled.span`
  position: relative;
  top: 1px;
`;
