const resolveTypeUserI = (data) => {
  const { parent } = data;

  return parent.bids || parent.auctions || parent.paymentMethods
    ? 'UserPrivate'
    : 'User';
};

const auctionCreator = async (data) => {
  const {
    context: { auth },
    parent: { createdBy }
  } = data;

  return auth.getUser(createdBy).then((user) => {
    return {
      id: createdBy,
      name: user.displayName,
      photoUrl: user.photoURL
    };
  });
};

const bidCreator = async (data) => {
  const {
    context: { auth },
    parent: { createdBy }
  } = data;

  return auth.getUser(createdBy).then((user) => {
    return {
      id: createdBy,
      name: user.displayName,
      photoUrl: user.photoURL
    };
  });
};

const queryMe = async (data) => {
  const {
    context: { user }
  } = data;

  if (!user.id) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    photoUrl: user.photoUrl
  };
};

module.exports = {
  UserI: {
    __resolveType: resolveTypeUserI
  },
  Auction: {
    creator: auctionCreator
  },
  Bid: {
    creator: bidCreator
  },
  Query: {
    me: queryMe
  }
};
