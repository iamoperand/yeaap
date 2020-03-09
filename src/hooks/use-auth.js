import { useEffect, useReducer } from 'react';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { get } from 'lodash';
import { useToasts } from 'react-toast-notifications';

import { auth } from '../utils/firebase';
import { getErrorMessage } from '../utils/error';

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

const GET_ME = gql`
  query currentUser {
    me {
      id
      name
      photoUrl
      paymentMethods {
        id
        source {
          ... on PaymentMethodCard {
            brand
            expires {
              month
              year
            }
            last4
            holderName
          }
        }
      }
      paymentPayoutAccount {
        id
        type
        country
        currency
        paymentMethods {
          id
          source {
            ... on PaymentMethodBankAccount {
              country
              currency
              last4
              routingNumber
              isVerified
              bankName
              holderName
            }
            ... on PaymentMethodCard {
              brand
              expires {
                month
                year
              }
              last4
              holderName
            }
          }
        }
        isVerificationRequired
      }
    }
  }
`;

const actions = {
  LOGGED_IN: 'LOGGED_IN',
  LOGGED_OUT: 'LOGGED_OUT',
  FETCH_USER: 'FETCH_USER',
  USER_FETCHED: 'USER_FETCHED',
  USER_FETCH_FAILED: 'USER_FETCH_FAILED'
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.LOGGED_IN: {
      return {
        ...state,
        loading: false,
        user: action.payload
      };
    }
    case actions.LOGGED_OUT: {
      return {
        ...state,
        loading: false,
        isUserLoading: false,
        user: null
      };
    }
    case actions.FETCH_USER: {
      return {
        ...state,
        loading: false,
        isUserLoading: true
      };
    }
    case actions.USER_FETCHED: {
      return {
        ...state,
        loading: false,
        isUserLoading: false,
        user: action.payload
      };
    }
    case actions.USER_FETCH_FAILED: {
      return {
        ...state,
        loading: false,
        isUserLoading: false,
        user: null
      };
    }
    default:
      return state;
  }
};

const useAuth = () => {
  const { addToast } = useToasts();
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    isUserLoading: true,
    user: null
  });

  const [getCurrentUser] = useLazyQuery(GET_ME, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      dispatch({ type: actions.USER_FETCHED, payload: get(data, 'me') });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, "Couldn't fetch the user");
      addToast(errorMessage, {
        appearance: 'error'
      });

      dispatch({ type: actions.USER_FETCH_FAILED });
    }
  });

  const [createUserSession] = useMutation(CREATE_USER_SESSION, {
    onError: (error) => {
      const errorMessage = getErrorMessage(error, "Couldn't login the user");
      addToast(errorMessage, {
        appearance: 'error'
      });

      dispatch({ type: actions.LOGGED_OUT });
    }
  });
  const [removeUserSession] = useMutation(REMOVE_USER_SESSION, {
    onError: (error) => {
      const errorMessage = getErrorMessage(error, "Couldn't login the user");
      addToast(errorMessage, {
        appearance: 'error'
      });

      dispatch({ type: actions.LOGGED_OUT });
    }
  });

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((result) => {
      if (result) {
        dispatch({ type: actions.FETCH_USER });
        getCurrentUser();

        createUserSession();
        return dispatch({ type: actions.LOGGED_IN, payload: result });
      }

      removeUserSession();
      return dispatch({ type: actions.LOGGED_OUT });
    });

    // unsubscribe to the listener when unmounting
    return unsubscribe;
  }, [createUserSession, removeUserSession, getCurrentUser]);

  return state;
};

export default useAuth;
