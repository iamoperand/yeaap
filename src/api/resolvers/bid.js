const { set, last, inRange } = require('lodash');
const uniqid = require('uniqid');
const moment = require('moment');
const { FieldValue } = require('firebase-admin').firestore;
const firestoreAsyncIterator = require('../firestore-async-iterator');
const queryCount = require('../util/query-count');
const pageDefaults = require('../util/page-defaults');

const bidToEdge = (auction) =>
  auction
    ? {
        node: auction,
        cursor: auction.createdAt
      }
    : { cursor: null };

const serializeFirestoreBid = (data) => ({
  ...data,
  createdAt: data.createdAt.toDate(),
  updatedAt: data.updatedAt.toDate(),
  creatorId: data.createdBy
});
const serializeFirestoreBidRefund = serializeFirestoreBid;

const auctionBidCount = async (data) => {
  const {
    context: { db },
    parent
  } = data;

  return queryCount(
    db
      .collection('bids')
      .select()
      .where('auctionId', '==', parent.id)
  );
};

const userBidCount = async (data) => {
  const {
    context: { db },
    parent
  } = data;

  return queryCount(
    db
      .collection('bids')
      .select()
      .where('createdBy', '==', parent.id)
  );
};

const bidRefund = async (data) => {
  const { parent } = data;
  return parent.refund ? serializeFirestoreBidRefund(parent.refund) : null;
};

const userBids = async (data) => {
  const { parent, args } = data;

  set(args, 'where.createdBy', parent.id);

  return queryBids(data);
};

const queryBids = async (data) => {
  const {
    context: { db },
    args: { where, page }
  } = data;

  const { order, sign, limit, cursor } = pageDefaults(page);

  let ref = db.collection('bids');

  if (where.auctionId) {
    ref = ref.where('auctionId', '==', where.auctionId);
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
    .then((snap) => snap.docs.map((doc) => serializeFirestoreBid(doc.data())));

  const nodeSlice = nodes.slice(0, limit);

  return {
    edges: nodeSlice.map(bidToEdge),
    pageInfo: {
      endCursor: bidToEdge(last(nodeSlice)).cursor,
      hasNextPage: nodes.length > nodeSlice.length
    }
  };
};

const onBidsCreated = {
  resolve(data) {
    const { parent: snap } = data;
    return snap
      .docChanges()
      .filter((change) => change.type === 'added')
      .map((change) => change.doc.data())
      .map(serializeFirestoreBid);
  },
  subscribe(data) {
    const {
      context: { db },
      args: { where }
    } = data;

    return firestoreAsyncIterator.asyncIterator(
      db
        .collection('bids')
        .where('auctionId', '==', where.auctionId)
        .orderBy('createdAt', 'DESC')
        .limit(20)
    );
  }
};

const createBidCheckConditionsHighestBidWins = async (data) => {
  const {
    context: { db, user },
    args: { where, data: inputData }
  } = data;

  const lastBid = await db
    .collection('bids')
    .where('auctionId', '==', where.auctionId)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get()
    .then((snap) =>
      snap.size ? serializeFirestoreBid(snap.docs[0].data()) : null
    );

  const minAmount = lastBid ? lastBid.amount + 1 : 10;

  if (!inRange(inputData.amount, minAmount, 10000)) {
    throw new Error('bid amount must be between ' + minAmount + '$ - 10000$');
  }

  if (lastBid && lastBid.createdBy === user.id) {
    throw new Error('you already hold the highest bid');
  }
};
const createBidCheckConditionsClosestBidWins = async (data) => {
  const {
    context: { db, user },
    args: { where, data: inputData }
  } = data;

  const bids = db.collection('bids');

  const myBid = await bids
    .where('auctionId', '==', where.auctionId)
    .where('createdBy', '==', user.id)
    .get();

  if (myBid.exsists) {
    throw new Error('you have already placed a bid');
  }

  if (!inRange(inputData.amount, 10, 10000)) {
    throw new Error('bid amount must be between 10$ - 10000$');
  }

  const amountExsists = await queryCount(
    bids
      .where('auctionId', '==', where.auctionId)
      .where('price', '==', inputData.amount)
  );

  if (amountExsists) {
    throw new Error('somebody already placed a bid with that amount');
  }
};
const createBid = async (data) => {
  const {
    context: { db, user, stripe },
    args: { where, data: inputData }
  } = data;

  const id = uniqid();
  const bids = db.collection('bids');
  const auctions = db.collection('auctions');

  const auction = await auctions
    .doc(where.auctionId)
    .get()
    .then((doc) => doc.data());

  switch (auction.type) {
    case 'HIGHEST_BID_WINS':
      await createBidCheckConditionsHighestBidWins(data);
      break;
    case 'CLOSEST_BID_WINS':
      await createBidCheckConditionsClosestBidWins(data);
      break;
    default:
      throw new Error('unknown auction type: ' + auction.type);
  }

  if (inputData.message && inputData.message.length > 256) {
    throw new Error('message is too large');
  }

  const source = await stripe.sources.retrieve(inputData.paymentMethodId);

  if (!source || source.customer !== user.stripeCustomerId) {
    throw new Error(
      'no attached payment source with id: ' + inputData.paymentMethodId
    );
  }

  if (
    auction.type === 'HIGHEST_BID_WINS' &&
    moment().add(2, 'minutes') > moment(auction.endsAt)
  ) {
    await auctions
      .doc(where.auctionId)
      .update({ endsAt: moment().add(2, 'minutes') });
  }

  return bids
    .doc(id)
    .set({
      ...inputData,
      id,
      message: inputData.message || null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: user.id,
      auctionId: where.auctionId,
      isWinner: false,
      refund: null
    })
    .then(() => bids.doc(id).get())
    .then((doc) => doc.data())
    .then(serializeFirestoreBid);
};

const requestBidRefund = async (data) => {
  const {
    context: { db },
    args: { where, data: inputData = {} }
  } = data;

  const id = where.bidId;
  const bids = db.collection('bids');

  if (inputData.message && inputData.message.length > 256) {
    throw new Error('message is too large');
  }

  return bids
    .doc(id)
    .update({
      refund: {
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        message: inputData.message || null,
        state: 'REQUESTED'
      },
      updatedAt: FieldValue.serverTimestamp()
    })
    .then(() => bids.doc(id).get())
    .then((doc) => doc.data())
    .then(serializeFirestoreBid);
};

const cancelBidRefund = async (data) => {
  const {
    context: { db },
    args: { where }
  } = data;

  const id = where.bidId;
  const bids = db.collection('bids');

  return bids
    .doc(id)
    .update({
      refund: null,
      updatedAt: FieldValue.serverTimestamp()
    })
    .then(() => bids.doc(id).get())
    .then((doc) => doc.data())
    .then(serializeFirestoreBid);
};

const acceptBidRefund = async (data) => {
  const {
    context: { db },
    args: { where }
  } = data;

  const id = where.bidId;
  const bids = db.collection('bids');

  return bids
    .doc(id)
    .update({
      'refund.updatedAt': FieldValue.serverTimestamp(),
      'refund.state': 'APPROVED',
      updatedAt: FieldValue.serverTimestamp()
    })
    .then(() => bids.doc(id).get())
    .then((doc) => doc.data())
    .then(serializeFirestoreBid);
};

const rejectBidRefund = async (data) => {
  const {
    context: { db },
    args: { where }
  } = data;

  const id = where.bidId;
  const bids = db.collection('bids');

  return bids
    .doc(id)
    .update({
      'refund.updatedAt': FieldValue.serverTimestamp(),
      'refund.state': 'DENIED',
      updatedAt: FieldValue.serverTimestamp()
    })
    .then(() => bids.doc(id).get())
    .then((doc) => doc.data())
    .then(serializeFirestoreBid);
};

module.exports = {
  Auction: {
    bidCount: auctionBidCount
  },
  UserPrivate: {
    bids: userBids,
    bidCount: userBidCount
  },
  Bid: {
    refund: bidRefund
  },
  Query: {
    bids: queryBids
  },
  Subscription: {
    onBidsCreated
  },
  Mutation: {
    createBid,
    requestBidRefund,
    cancelBidRefund,
    acceptBidRefund,
    rejectBidRefund
  }
};
