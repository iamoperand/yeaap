const { last, set, inRange } = require('lodash');
const uniqid = require('uniqid');
const moment = require('moment');
const { FieldValue } = require('firebase-admin').firestore;
const firestoreAsyncIterator = require('../firestore-async-iterator');

const auctionToEdge = (auction) =>
  auction
    ? {
        node: auction,
        cursor: auction.createdAt
      }
    : { cursor: null };

const serializeFirestoreAuction = (data) => ({
  ...data,
  createdAt: data.createdAt.toDate(),
  updatedAt: data.updatedAt.toDate(),
  endsAt: data.endsAt.toDate(),
  creatorId: data.createdBy
});

const userAuctions = async (data) => {
  const { parent, args } = data;

  set(args, 'where.createdBy', parent.id);

  return queryAuctions(data);
};

const queryAuctions = async (data) => {
  const {
    context: { db },
    args: { where, page }
  } = data;

  let ref = db.collection('auctions');

  if (where.auctionId) {
    ref = ref.where('id', '==', where.auctionId);
  }

  if (where.createdBy) {
    ref = ref.where('createdBy', '==', where.createdBy);
  }

  if (page) {
    const direction = page.order === 'ASC' ? '>' : '<';
    ref = ref.where('createdAt', direction, page.cursor);
  }

  ref = ref.orderBy('createdAt', (page && page.order) || 'DESC');

  const nodes = await ref
    .limit(21)
    .get()
    .then((snap) =>
      snap.docs.map((doc) => serializeFirestoreAuction(doc.data()))
    );

  const nodeSlice = nodes.slice(0, 20);

  return {
    edges: nodeSlice.map(auctionToEdge),
    pageInfo: {
      endCursor: auctionToEdge(last(nodeSlice)).cursor,
      hasNextPage: nodeSlice.length > nodes.length
    }
  };
};

const onAuctionUpdated = {
  resolve(data) {
    const { parent: snap } = data;
    return serializeFirestoreAuction(snap.data());
  },
  subscribe(data) {
    const {
      context: { db },
      args: { where }
    } = data;

    return firestoreAsyncIterator.asyncIterator(
      db.collection('auctions').doc(where.auctionId)
    );
  }
};

const createAuction = async (data) => {
  const {
    context: { db, user },
    args: { data: inputData }
  } = data;

  if (moment().add(10, 'minutes') > moment(inputData.endsAt)) {
    throw new Error('auction duration is too short or in the past');
  }

  if (!inRange(inputData.winnerCount, 1, 100)) {
    throw new Error('winner count must be between 1 - 100 bids');
  }

  const id = uniqid();
  const auctions = db.collection('auctions');

  return auctions
    .doc(id)
    .set({
      ...inputData,
      id,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: user.id,
      isCanceled: false
    })
    .then(() => auctions.doc(id).get())
    .then((doc) => serializeFirestoreAuction(doc.data()));
};

const updateAuction = async (data) => {
  const {
    context: { db },
    args: { where, data: inputData }
  } = data;

  const auctions = db.collection('auctions');

  if (inputData.endsAt) {
    if (moment().add(2, 'minutes') > moment(inputData.endsAt)) {
      throw new Error('auction duration is too short or in the past');
    }
  }

  await auctions.doc(where.auctionId).update({
    ...inputData,
    updatedAt: FieldValue.serverTimestamp()
  });
  return auctions
    .doc(where.auctionId)
    .get()
    .then((doc) => serializeFirestoreAuction(doc.data()));
};

const cancelAuction = async (data) => {
  const {
    context: { db },
    args: { where }
  } = data;

  const auctions = db.collection('auctions');

  await auctions.doc(where.auctionId).update({
    isCanceled: true,
    updatedAt: FieldValue.serverTimestamp()
  });
  return auctions
    .doc(where.auctionId)
    .get()
    .then((doc) => serializeFirestoreAuction(doc.data()));
};

module.exports = {
  UserWithAuctionsAndBids: {
    auctions: userAuctions
  },
  Query: {
    auctions: queryAuctions
  },
  Subscription: {
    onAuctionUpdated
  },
  Mutation: {
    createAuction,
    updateAuction,
    cancelAuction
  }
};
