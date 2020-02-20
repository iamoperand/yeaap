const createUserSession = (data) => {
  const {
    context: { req, user }
  } = data;

  req.session.user = user._data;
  return true;
};

const removeUserSession = (data) => {
  const {
    context: { req }
  } = data;

  req.session.user = null;
  return true;
};

module.exports = {
  Mutation: {
    createUserSession,
    removeUserSession
  }
};
