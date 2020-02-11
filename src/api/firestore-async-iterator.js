const { isArray } = require('lodash');
const { PubSubEngine } = require('apollo-server-express');

class FirestorePubSubEngine extends PubSubEngine {
  constructor() {
    super();

    this._observers = {};
    this._id = 0;
  }
  publish() {
    throw new Error('firestore PubSub Engine is used to only RECEIVE events');
  }
  subscribe(query, onSnapshot) {
    return new Promise((resolve, reject) => {
      let handled = false;
      const observer = query.onSnapshot((snap) => {
        if (!handled) {
          handled = true;
          const id = this._id++;
          this._observers[id] = observer;
          resolve(id);
        }

        onSnapshot(snap);
      }, reject);
    });
  }
  unsubscribe(id) {
    const closeObserver = this._observers[id];

    if (!closeObserver) {
      throw new Error('no subscription with id ' + id);
    }

    closeObserver();
    delete this._observers[id];
  }
  asyncIterator(queries) {
    return super.asyncIterator(isArray(queries) ? queries : [queries]);
  }
}

module.exports = new FirestorePubSubEngine();
