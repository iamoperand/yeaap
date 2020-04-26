const { FieldValue } = require('firebase-admin').firestore;
const config = require('../../config');

const serializeFirestoreWaitListNode = (data) => ({
  ...data,
  createdAt: data.createdAt.toDate(),
  updatedAt: data.updatedAt.toDate()
});

const queryWaitList = async (data) => {
  const {
    context: { db },
    args: { data: inputData }
  } = data;

  if (inputData.credentials !== config.get('session_secret')) {
    throw new Error(`You're not authorized to perform this action`);
  }

  return db
    .collection('waitlist')
    .orderBy('createdAt', 'DESC')
    .get()
    .then((snap) =>
      snap.docs.map((doc) => serializeFirestoreWaitListNode(doc.data()))
    );
};

const joinWaitList = async (data) => {
  const {
    context: { db },
    args: { data: inputData }
  } = data;

  await db.collection('waitlist').add({
    ...inputData,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });

  return true;
};

module.exports = {
  Query: {
    queryWaitList
  },
  Mutation: {
    joinWaitList
  }
};
