const { get, set } = require('lodash');

class User {
  constructor(data, db) {
    this._data = data;
    this._db = db;
  }
  async _updateFirestoreUser(updates) {
    if (!this.id || !this._db) {
      return updates;
    }

    return this._db
      .collection('users')
      .doc(this.id)
      .update(updates)
      .then(() => updates);
  }
  get id() {
    return get(this._data, 'uid', null);
  }
  get email() {
    return get(this._data, 'email', null);
  }
  get name() {
    return get(this._data, 'displayName', null);
  }
  get stripeCustomerId() {
    return get(this._data, 'firestoreUser.stripeCustomerId', null);
  }
  set stripeCustomerId(id) {
    set(this._data, 'firestoreUser.stripeCustomerId', id);
    return this._updateFirestoreUser({ stripeCustomerId: id });
  }
  get stripeAccountId() {
    return get(this._data, 'firestoreUser.stripeAccountId', null);
  }
  set stripeAccountId(id) {
    set(this._data, 'firestoreUser.stripeAccountId', id);
    return this._updateFirestoreUser({ stripeAccountId: id });
  }
}

module.exports = User;
