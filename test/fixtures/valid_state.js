import { fromPairs, map } from 'lodash';
import { ValidSchema as schema } from './valid_schema';

export default function ValidState() {
  return {
    api: { url, schema, changefeeds },
    collections
  };
}

export const url = 'http://testing.com';

const changefeedsIterator = i => [
  `${url}/${i.pluralName}`,
  { state: 'initializing' }
];
export const changefeeds = mapToObject(schema, changefeedsIterator);
export const collections = mapToObject(Object.keys(schema), i => [i, {}]);

function mapToObject(list, func) {
  return fromPairs(map(list, func));
}
