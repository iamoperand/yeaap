import React from 'react';
import PropTypes from 'prop-types';

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

const AuthProvider = ({ children, ...rest }) => {
  const { loading, user, isUserLoading } = useAuth();

  return (
    <AuthContext.Provider
      value={{ user, isUserLoading }}
      {...rest}
      children={loading ? <LoadingLayout /> : children}
    />
  );
};

AuthProvider.propTypes = {
  children: PropTypes.any
};

export { AuthProvider, AuthContext };
