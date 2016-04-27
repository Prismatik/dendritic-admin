import { fromPairs, map } from 'lodash';
import { ValidSchema } from './valid_schema';

const API_URL = 'http://testing.com';

export default function ValidState() {
  return {
    api: {
      url: API_URL,
      schema: ValidSchema
    },
    collections: fromPairs(map(Object.keys(ValidSchema), i => [i, {}]))
  };
}
