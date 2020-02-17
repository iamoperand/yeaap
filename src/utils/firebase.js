import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import clientConfig from './client-config';

if (!firebase.apps.length) {
  firebase.initializeApp(clientConfig.firebase.config);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export default firebase;
