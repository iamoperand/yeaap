import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

if (!firebase.apps.length) {
  firebase.initializeApp(publicRuntimeConfig.firebaseAppConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export default firebase;
