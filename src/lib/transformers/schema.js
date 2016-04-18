import _, { flowRight, fromPairs, isUndefined, map, reduce } from 'lodash';
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

export function mapSchemaToFormInputs(props, data) {
  const schemaProps = flowRight(deepToFlat, extractProps)(props);

  return mapSchema(schemaProps, data)((flatProps, flatValue) => {
    return map(flatProps, (val, key) => {
      const parsed = JSON.parse(val);

      if (parsed.type == 'string') parsed.type = 'text';
      parsed.value = flatValue[key];

      return [key, _(parsed).omit('faker').omitBy(isUndefined).value()];
    });
  });
}

export function extractHeaders(schemaProps) {
  return flowRight(Object.keys, deepToFlat, extractProps)(schemaProps);
}

export function arrayToStr(array) { return '[' + array.join(', ') + ']'; }

function mapSchema(props, data) {
  if (!Array.isArray(data)) data = [data];
  return iterator => data.map(value => {
    return fromPairs(iterator(props, deepToFlat(value)));
  });
}

function extractProps(obj) {
  return reduce(obj, (result, value, key) => {
    if (!value.type) result[key] = extractProps(value);
    else result[key] = JSON.stringify(value);
    return result;
  }, {});
}

function valueToLink(links, prop, value) {
  const index = map(links, 'rel').indexOf(prop);
  if (index >= 0) return links[index].href.replace(`{${prop}}`, value);
  return value;
}
