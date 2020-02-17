const { forEach, isUndefined } = require('lodash');
const { defaultFieldResolver } = require('graphql');
const { SchemaDirectiveVisitor } = require('graphql-tools');

class RequireUserDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requireUserArgs = this.args;
  }
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requireUserArgs = this.args;
  }

  ensureFieldsWrapped(objectType) {
    if (objectType._requireUserFieldsWrapped) {
      return;
    }
    objectType._requireUserFieldsWrapped = true;

    forEach(objectType.getFields(), (field) => {
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function(...args) {
        const requireUserArgs =
          field._requireUserArgs || objectType._requireUserArgs;

        const { user, stripe } = args[2]; // context

        if (!user.id) {
          throw new Error('user required for this operation');
        }

        if (!requireUserArgs) {
          return resolve.apply(this, args);
        }

        const { hasPaymentMethod, hasPaymentPayoutMethod } = requireUserArgs;

        if (!isUndefined(hasPaymentMethod)) {
          const hasPaymentMethods = await stripe.customers
            .retrieve(user.stripeCustomerId)
            .then((res) => Boolean(res.sources.data.length))
            .catch(() => false);

          if (hasPaymentMethod !== hasPaymentMethods) {
            const str = hasPaymentMethod ? 'expected' : 'not expected';
            throw new Error('user ' + str + ' to have billing setup');
          }
        }

        const payoutSetupMatch =
          hasPaymentPayoutMethod === Boolean(user.stripeAccountId);

        if (!isUndefined(hasPaymentPayoutMethod) && !payoutSetupMatch) {
          const str = hasPaymentPayoutMethod ? 'expected' : 'not expected';
          throw new Error('user ' + str + ' to have payout setup');
        }

        return resolve.apply(this, args);
      };
    });
  }
}

module.exports = RequireUserDirective;
