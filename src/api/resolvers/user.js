const resolveTypeUserI = (data) => {
  const { parent } = data;

  return parent.bids || parent.auctions || parent.paymentMethods
    ? 'UserPrivate'
    : 'User';
};

const auctionCreator = async (data) => {
  const {
    parent: { createdBy }
  } = data;

  return {
    id: createdBy,
    name: 'John Doe'
  };
};

const bidCreator = async (data) => {
  const {
    parent: { createdBy }
  } = data;

  return {
    id: createdBy,
    name: 'John Doe'
  };
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
    name: 'John Doe'
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
