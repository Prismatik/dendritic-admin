const _ = require('lodash');
const Dotize = require('dotize');

exports.transform = function transform(schema, data) {
  const schemaProps = exports.extractHeaders(schema.properties);

  if (!Array.isArray(data)) data = [data];
  return data.map(record => {
    const dotRecord = Dotize.convert(record);
    const item = schemaProps.map(property => {
      const value = dotRecord[property];
      return [property, value];
    });
    return _.fromPairs(item);
  });
};

exports.extractHeaders = function extractHeaders(schemaProps) {
  const rawProps = extractProps(schemaProps);
  const dotSchema = Dotize.convert(rawProps);
  return Object.keys(dotSchema);
};

function extractProps(obj) {
  return _.reduce(obj, (result, value, key) => {
    if (!value.type) result[key] = extractProps(value);
    else result[key] = null;
    return result;
  }, {});
}
