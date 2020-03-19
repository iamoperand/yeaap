import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import AccountDetails from '../components/account-details';

import redirectWithSSR from '../utils/redirect-with-ssr';
import { auth } from '../utils/firebase';

const Account = () => {
  return (
    <Layout>
      <SEO title="Account" />

      <AccountDetails />
    </Layout>
  );
};

Account.getInitialProps = ({ req, res }) => {
  const isServer = !process.browser;

  const user = isServer
    ? req && req.session
      ? req.session.user
      : null
    : auth.currentUser;
  if (!user) {
    redirectWithSSR({ res, path: '/' });
  }

  return {};
};

export default Account;

/*
 ********************************************
 styled components
 ********************************************
 */
