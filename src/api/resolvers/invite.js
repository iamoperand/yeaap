const shortid = require('shortid');
const uniqid = require('uniqid');
const { FieldValue } = require('firebase-admin').firestore;
const { has } = require('lodash');
const config = require('../../config');

const serializeFirestoreInvite = (data) => ({
  ...data,
  createdAt: data.createdAt.toDate(),
  updatedAt: data.updatedAt.toDate()
});

const queryInvites = async (data) => {
  const {
    context: { db },
    args: { data: inputData, where }
  } = data;

  if (inputData.credentials !== config.get('session_secret')) {
    throw new Error(`You're not authorized to perform this action`);
  }

  let ref = db.collection('invites');
  if (has(where, 'code')) {
    ref = ref.where('code', '==', where.code);
  }

  return ref
    .orderBy('createdAt', 'DESC')
    .get()
    .then((snap) =>
      snap.docs.map((doc) => serializeFirestoreInvite(doc.data()))
    );
};

const generateInvite = async (data) => {
  const {
    context: { db },
    args: { data: inputData }
  } = data;

  if (inputData.credentials !== config.get('session_secret')) {
    throw new Error(`You're not authorized to perform this action`);
  }

  const id = uniqid();
  const invites = db.collection('invites');

  return invites
    .doc(id)
    .set({
      id,
      code: shortid.generate(),
      purpose: inputData.purpose,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    })
    .then(() => invites.doc(id).get())
    .then((doc) => serializeFirestoreInvite(doc.data()));
};

module.exports = {
  Query: {
    invites: queryInvites
  },
  Mutation: {
    generateInvite
  }
};
