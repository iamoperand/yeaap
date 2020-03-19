import React from 'react';
import styled from '@emotion/styled';

import Loading from '../loading';
import NotFound from '../not-found';
import UserDetails from './user-details';
import PaymentDetails from './payment-details';
import AccountBalance from './account-balance';
import UserAuctions from './user-auctions';
import UserBids from './user-bids';

import useSession from '../../hooks/use-session';

import rem from '../../utils/rem';

const AccountDetails = () => {
  const { user, isUserLoading } = useSession();

  if (isUserLoading) {
    return <Loading />;
  }

  if (!user) {
    return <NotFound text="User not found." showLoginButton={true} />;
  }
  return (
    <div>
      <UserDetails user={user} />
      <Margin value={30} />
      <PaymentDetails user={user} />
      <Margin value={40} />
      <AccountBalance balance={user.accountBalance} />

      <Hr />

      <UserAuctions auctionConnection={user.auctions} />
      <Margin value={40} />
      <UserBids bidConnection={user.bids} />
    </div>
  );
};

export default AccountDetails;

/*
 ********************************************
 styled components
 ********************************************
 */

const Margin = styled.div`
  margin-top: ${(props) => rem(props.value) || 0};
`;

const Hr = styled.hr`
  border: 1px solid #afafaf;
  margin: ${rem(50)} 0 ${rem(40)};
`;
