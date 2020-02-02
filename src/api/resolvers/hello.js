const { PubSub } = require('apollo-server-express');

const pubsub = new PubSub();
const HELLO_MESSAGE = 'HELLO_MESSAGE';

module.exports = {
  Mutation: {
    sayHello: (data) => {
      const { args } = data;
      pubsub.publish(HELLO_MESSAGE, { hello: 'Hello, ' + args.name });
      return true;
    }
  },
  Query: {
    hello: () => 'World'
  },
  Subscription: {
    hello: {
      subscribe: () => pubsub.asyncIterator(HELLO_MESSAGE)
    }
  }
};
