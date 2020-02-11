const { forEach, get, isUndefined } = require('lodash');
const { defaultFieldResolver } = require('graphql');
const { SchemaDirectiveVisitor } = require('graphql-tools');
const moment = require('moment');

class RequireAuctionDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requireAuctionArgs = this.args;
  }
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requireAuctionArgs = this.args;
  }

  ensureFieldsWrapped(objectType) {
    if (objectType._requireAuctionFieldsWrapped) {
      return;
    }
    objectType._requireAuctionFieldsWrapped = true;

    forEach(objectType.getFields(), (field) => {
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function(...args) {
        const requireAuctionArgs =
          field._requireAuctionArgs || objectType._requireAuctionArgs;

        if (!requireAuctionArgs) {
          return resolve.apply(this, args);
        }

        const {
          auctionIdRef,
          isActive,
          isOwner,
          isCanceled: isCanceled_
        } = requireAuctionArgs;

        const queryArgs = args[1]; // query args
        const { db, user } = args[2]; // context

        const auctionId = get(queryArgs, auctionIdRef || 'where.auctionId');

        if (!auctionId) {
          throw new Error('auction id is required but none provided');
        }

        const doc = await db
          .collection('auctions')
          .doc(auctionId)
          .get();

        if (!doc.exists) {
          throw new Error('no auction with id: ' + auctionId);
        }

        const { isCanceled, endsAt, createdBy } = doc.data();

        if (!isUndefined(isCanceled_) && isCanceled_ !== isCanceled) {
          const str = isCanceled_ ? 'CANCELED' : 'UNCANCELED';
          throw new Error('no ' + str + ' auction with id: ' + auctionId);
        }

        const isPastOrCanceled =
          moment() > moment(endsAt.toDate()) || isCanceled;

        if (!isUndefined(isActive) && isActive === isPastOrCanceled) {
          const str = isActive ? 'ACTIVE' : 'INACTIVE';
          throw new Error('no ' + str + ' auction with id: ' + auctionId);
        }

        const isOwned = Boolean(user.id && createdBy === user.id);

        if (!isUndefined(isOwner) && isOwner !== isOwned) {
          const str = isOwned ? 'owned' : 'not owned';
          throw new Error(
            'auction with id: ' + auctionId + ' is ' + str + ' by this user'
          );
        }

        return resolve.apply(this, args);
      };
    });
  }
}

module.exports = RequireAuctionDirective;
