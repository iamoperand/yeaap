import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { auth } from '../utils/firebase';

const CREATE_USER_SESSION = gql`
  mutation {
    createUserSession
  }
`;
const REMOVE_USER_SESSION = gql`
  mutation {
    removeUserSession
  }
`;

const useAuth = () => {
  const [state, setState] = useState(() => ({
    loading: true,
    user: auth.currentUser
  }));

  const [createUserSession] = useMutation(CREATE_USER_SESSION, {
    onError: () => {
      console.error('There was some error while logging in!');
    }
  });
  const [removeUserSession] = useMutation(REMOVE_USER_SESSION);

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((result) => {
      if (result) {
        setState({ loading: false, user: result });
        return createUserSession();
      }

      setState({ loading: false, user: null });
      return removeUserSession();
    });

    // unsubscribe to the listener when unmounting
    return unsubscribe;
  }, [createUserSession, removeUserSession]);

  return state;
};

export default useAuth;
