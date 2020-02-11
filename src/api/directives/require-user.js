const { forEach } = require('lodash');
const { defaultFieldResolver } = require('graphql');
const { SchemaDirectiveVisitor } = require('graphql-tools');

class RequireUserDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requireUserOptions = this.args.options;
  }
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requireUserOptions = this.args.options;
  }

  ensureFieldsWrapped(objectType) {
    if (objectType._requireUserFieldsWrapped) {
      return;
    }
    objectType._requireUserFieldsWrapped = true;

    forEach(objectType.getFields(), (field) => {
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function(...args) {
        const options =
          field._requireUserOptions || objectType._requireUserOptions;

        const { user } = args[2]; // context
        await user.verifyOptionsOrThrow(options);

        return resolve.apply(this, args);
      };
    });
  }
}

module.exports = RequireUserDirective;
