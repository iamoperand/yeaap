#!/usr/bin/env node

const firebaseAdmin = require('firebase-admin');
const fetch = require('node-fetch');
const clipboardy = require('clipboardy');
const config = require('./src/config');

const exec = async (userId) => {
  if (!userId) {
    throw new Error('Required userId as input.');
  }

  const firebase = config.get('firebase');

  if (!firebase.credentials) {
    throw new Error('Missing FIREBASE_CREDENTIALS variable; aborting...');
  }
  if (!firebase.webapiKey) {
    throw new Error('Missing FIREBASE_WEBAPI_KEY variable; aborting...');
  }

  const token = await firebaseAdmin
    .initializeApp({
      credential: firebaseAdmin.credential.cert(
        config.get('firebase').credentials
      )
    })
    .auth()
    .createCustomToken(userId);

  const res = await fetch(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${firebase.webapiKey}`,
    {
      method: 'POST',
      body: JSON.stringify({
        token,
        returnSecureToken: true
      })
    }
  );

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const json = await res.json();

  clipboardy.writeSync(json.idToken);
  console.info('-- token written to clipboard --\n');
  console.info(json.idToken);
};

exec(process.argv[2])
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error!', err.message);
    process.exit(1);
  });
