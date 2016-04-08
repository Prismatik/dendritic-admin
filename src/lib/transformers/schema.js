import _ from 'lodash';
import { deepToFlat } from '../object';

export function transform(schema, data) {
  const schemaProps = extractHeaders(schema.properties);

  if (!Array.isArray(data)) data = [data];
  return data.map(record => {
    const flatObj = deepToFlat(record);
    const item = schemaProps.map(property => {
      let value = flatObj[property];
      if (schema.links) value = valueToLink(schema.links, property, value);
      if (Array.isArray(value)) value = arrayToStr(value);
      return [property, value];
    });
    return _.fromPairs(item);
  });
};

export function extractHeaders(schemaProps) {
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

function arrayToStr(array) { return "[" + array.join(', ') + "]"; }

function valueToLink(links, prop, value) {
  const index = _.map(links, 'rel').indexOf(prop);
  if (index >= 0) return links[index].href.replace(`{${prop}}`, value);
  return value;
}
