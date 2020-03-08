import { useContext } from 'react';
import { isUndefined } from 'lodash';

import { AuthContext } from '../context/auth-context';

const useSession = () => {
  const context = useContext(AuthContext);
  if (isUndefined(context)) {
    throw new Error('useSession must be used within AuthContext');
  }
  return context;
};

export default useSession;
