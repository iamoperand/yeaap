const { defaults, min } = require('lodash');

module.exports = (page) => {
  const { order, limit, cursor } = defaults(page, {
    order: 'DESC',
    limit: 20
  });

  return {
    order,
    cursor: cursor ? new Date(+cursor) : null,
    sign: order === 'ASC' ? '>' : '<',
    limit: limit > 0 ? min([limit, 50]) : 0
  };
};
