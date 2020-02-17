import { useState, useEffect } from 'react';

import { auth } from '../utils/firebase';

const useAuth = () => {
  const [state, setState] = useState(() => ({
    loading: true,
    user: auth.currentUser
  }));

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((result) => {
      if (result) {
        return setState({ loading: false, user: result });
      }

      return setState({ loading: false, user: null });
    });

    // unsubscribe to the listener when unmounting
    return unsubscribe;
  }, []);

  return state;
};

export default useAuth;
