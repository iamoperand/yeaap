const { forEach, get, isUndefined } = require('lodash');
const { defaultFieldResolver } = require('graphql');
const { SchemaDirectiveVisitor } = require('graphql-tools');

class RequireBidDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requireBidArgs = this.args;
  }
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requireBidArgs = this.args;
  }

  ensureFieldsWrapped(objectType) {
    if (objectType._requireBidFieldsWrapped) {
      return;
    }
    objectType._requireBidFieldsWrapped = true;

    forEach(objectType.getFields(), (field) => {
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function(...args) {
        const requireBidArgs =
          field._requireBidArgs || objectType._requireBidArgs;

        if (!requireBidArgs) {
          return resolve.apply(this, args);
        }

        const { bidIdRef, isOwner, refundState } = requireBidArgs;

        const queryArgs = args[1]; // query args
        const { db, user } = args[2]; // context

        const bidId = get(queryArgs, bidIdRef || 'where.bidId');

        if (!bidId) {
          throw new Error('bid id is required but none provided');
        }

        const doc = await db
          .collection('bids')
          .doc(bidId)
          .get();

        if (!doc.exists) {
          throw new Error('no bid with id: ' + bidId);
        }

        const { createdBy, refund } = doc.data();

        const isOwned = Boolean(user.id && createdBy === user.id);

        if (!isUndefined(isOwner) && isOwner !== isOwned) {
          const str = isOwned ? 'owned' : 'not owned';
          throw new Error(
            'bid with id: ' + bidId + ' is ' + str + ' by this user'
          );
        }

        const rstate = get(refund, 'state', null);

        if (!isUndefined(refundState) && refundState !== rstate) {
          throw new Error(
            'refund state ' + refundState + ' expected; ' + rstate + ' received'
          );
        }

        return resolve.apply(this, args);
      };
    });
  }
}

module.exports = RequireBidDirective;
