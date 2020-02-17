import { useContext } from 'react';

import { AuthContext } from '../context/auth-context';

const useSession = () => {
  const { user } = useContext(AuthContext);
  return user;
};

export default useSession;
