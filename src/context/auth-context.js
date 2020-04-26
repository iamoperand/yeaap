import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import useAuth from '../hooks/use-auth';
import Layout from '../components/layout';
import Loading from '../components/loading';

const AuthContext = React.createContext({
  user: null
});

const LoadingLayout = () => (
  <Layout>
    <Loading />
  </Layout>
);

const checkIfUserIsMust = (pathname) => {
  return pathname !== '/';
};

const AuthProvider = ({ children, ...rest }) => {
  const router = useRouter();
  const { loading, user, isUserLoading } = useAuth();

  const { pathname } = router;
  const isUserMust = checkIfUserIsMust(pathname);

  const showLoading = isUserMust && loading;
  return (
    <AuthContext.Provider
      value={{ user, isUserLoading }}
      {...rest}
      children={showLoading ? <LoadingLayout /> : children}
    />
  );
};

AuthProvider.propTypes = {
  children: PropTypes.any
};

export { AuthProvider, AuthContext };
