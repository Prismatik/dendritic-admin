import { flow, cloneDeep } from 'lodash';
import { deepFreeze } from 'root/src/lib/object';
import schema from './valid_schema.json';

export const ValidSchema = flow(cloneDeep, deepFreeze)(schema);
