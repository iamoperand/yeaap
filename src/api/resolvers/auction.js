const { last, set, inRange } = require('lodash');
const uniqid = require('uniqid');
const moment = require('moment');
const { FieldValue } = require('firebase-admin').firestore;
const firestoreAsyncIterator = require('../firestore-async-iterator');
const queryCount = require('../util/query-count');
const pageDefaults = require('../util/page-defaults');

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

const userAuctionCount = async (data) => {
  const {
    context: { db },
    parent
  } = data;

  return queryCount(
    db
      .collection('auctions')
      .select()
      .where('createdBy', '==', parent.id)
  );
};

const bidAuction = async (data) => {
  const {
    context: { db },
    parent
  } = data;

  return db
    .collection('auctions')
    .doc(parent.auctionId)
    .get()
    .then((doc) => serializeFirestoreAuction(doc.data()));
};

const queryAuctions = async (data) => {
  const {
    context: { db },
    args: { where, page }
  } = data;

  const { order, sign, limit, cursor } = pageDefaults(page);

  let ref = db.collection('auctions');

  if (where.auctionId) {
    ref = ref.where('id', '==', where.auctionId);
  }

  if (where.createdBy) {
    ref = ref.where('createdBy', '==', where.createdBy);
  }

  if (cursor) {
    ref = ref.where('createdAt', sign, new Date(+cursor));
  }

  const nodes = await ref
    .orderBy('createdAt', order)
    .limit(limit + 1)
    .get()
    .then((snap) =>
      snap.docs.map((doc) => serializeFirestoreAuction(doc.data()))
    );

  const nodeSlice = nodes.slice(0, limit);

  return {
    edges: nodeSlice.map(auctionToEdge),
    pageInfo: {
      endCursor: auctionToEdge(last(nodeSlice)).cursor,
      hasNextPage: nodes.length > nodeSlice.length
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

  if (!inRange(inputData.winnerCount, 1, 10)) {
    throw new Error('winner count must be between 1 - 10 bids');
  }

  if (inputData.type === 'CLOSEST_BID_WINS' && !inputData.amount) {
    throw new Error('must provide amount for this auction type');
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
      isCanceled: false,
      isSettled: false
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
  UserPrivate: {
    auctions: userAuctions,
    auctionCount: userAuctionCount
  },
  Bid: {
    auction: bidAuction
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
