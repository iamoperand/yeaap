const { isFunction, isObject, mapValues, merge } = require('lodash');
const {
  DateTimeResolver,
  URLResolver,
  EmailAddressResolver,
  UnsignedFloatResolver
} = require('graphql-scalars');

const mapResolverFunctions = (resolve) => {
  if (isFunction(resolve)) {
    return (parent, args, context) => resolve({ context, parent, args });
  }
  if (isObject(resolve)) {
    return mapValues(resolve, mapResolverFunctions);
  }
  return resolve;
};

module.exports = merge(
  {
    URL: URLResolver,
    DateTime: DateTimeResolver,
    Email: EmailAddressResolver,
    UnsignedFloat: UnsignedFloatResolver
  },
  ...['auction', 'bid', 'payment', 'session', 'user', 'wait-list', 'invite']
    .map((mod) => require('./' + mod))
    .map(mapResolverFunctions)
);
