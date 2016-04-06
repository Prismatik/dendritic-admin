const _ = require("lodash");

module.exports = function transform(schema, data) {
  const schemaProps = Object.keys(schema.properties);

  return data.map(record => {
    const item = schemaProps.map(property => {
      const value = record[property];
      return [property, value];
    });
    return _.fromPairs(item);
  });
};
