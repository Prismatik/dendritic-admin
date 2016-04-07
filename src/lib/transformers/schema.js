const _ = require('lodash');
const deepToFlat = require('../object').deepToFlat;

exports.transform = function transform(schema, data) {
  const schemaProps = exports.extractHeaders(schema.properties);

  if (!Array.isArray(data)) data = [data];
  return data.map(record => {
    const flatObj = deepToFlat(record);
    const item = schemaProps.map(property => {
      var value = flatObj[property];
      if (Array.isArray(value)) value = "[" + value.join(', ') + "]";
      return [property, value];
    });
    return _.fromPairs(item);
  });
};

exports.extractHeaders = function extractHeaders(schemaProps) {
  const rawProps = extractProps(schemaProps);
  const dotSchema = deepToFlat(rawProps);
  return Object.keys(dotSchema);
};

function extractProps(obj) {
  return _.reduce(obj, (result, value, key) => {
    if (!value.type) result[key] = extractProps(value);
    else result[key] = null;
    return result;
  }, {});
}
