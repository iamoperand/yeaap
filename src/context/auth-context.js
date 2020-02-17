import React from 'react';

import useAuth from '../hooks/use-auth';

const AuthContext = React.createContext({
  user: null
});

const AuthProvider = (props) => {
  const { loading, user } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={{ user }} {...props} />;
};

export { AuthProvider, AuthContext };
