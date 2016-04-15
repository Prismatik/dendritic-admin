import { flowRight, fromPairs, map, reduce } from 'lodash';
import { deepToFlat } from '../object';

export function mapSchemaToData(schema, data) {
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
    return fromPairs(item);
  });
}

export function extractHeaders(schemaProps) {
  return flowRight(Object.keys, deepToFlat, extractProps)(schemaProps);
}

export function arrayToStr(array) { return '[' + array.join(', ') + ']'; }

function extractProps(obj) {
  return reduce(obj, (result, value, key) => {
    if (!value.type) result[key] = extractProps(value);
    else result[key] = null;
    return result;
  }, {});
}

function valueToLink(links, prop, value) {
  const index = map(links, 'rel').indexOf(prop);
  if (index >= 0) return links[index].href.replace(`{${prop}}`, value);
  return value;
}
