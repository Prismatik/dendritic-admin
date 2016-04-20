import { fromPairs, map } from 'lodash';
import { ValidSchema } from './valid_schema';

export default function ValidState() {
  return {
    api: {
      url: 'http://testing.com',
      schema: ValidSchema
    },
    collections: fromPairs(map(Object.keys(ValidSchema), i => [i, {}]))
  };
}
