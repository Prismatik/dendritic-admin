import { filter, fromPairs, head, mapValues, omitBy } from 'lodash';
import { handleActions } from 'redux-actions';
import { mapSchemaToData } from '../../lib/transformers/schema';

export const collections = handleActions({
  'GET_COLLECTIONS_SUCCESS': (state, action) => {
    const schemas = clean(action.payload);
    return fromPairs(schemas.map(i => [i, {}]));
  },
  'ADD_TO_COLLECTION': (state, action) => {
    const { item, schema, collection, status } = action.payload;
    const transformed = head(mapSchemaToData(schema, item));

    return {
      ...state,
      [collection]: {
        ...state[collection],
        [item.id]: { ...transformed, changefeed: { state: status } }
      }
    };
  },
  'REMOVE_FROM_COLLECTION': (state, action) => {
    const { item, collection } = action.payload;

    return {
      ...state,
      [collection]: omitBy(state[collection], (val, key) => key == item.id)
    };
  },
  'UPDATE_DOCUMENT_CHANGEFEED_STATE': (state, action) => {
    const { status, collection } = action.payload;

    return {
      ...state,
      [collection]: mapValues(state[collection], o => {
        if (o.changefeed && o.changefeed.state) o.changefeed.state = status;
        return o;
      })
    };
  }
}, {});

function clean(schemas) {
  return filter(schemas, item => item !== 'definitions');
}
