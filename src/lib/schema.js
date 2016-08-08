import { find } from 'lodash';

export function getByPlural(schemas, name) {
  return find(schemas, schema => schema.pluralName === name);
}
