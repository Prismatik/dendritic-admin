import { fromPairs, head, mapValues, omitBy } from 'lodash';
import { handleActions } from 'redux-actions';
import { mapSchemaToData } from '../../lib/transformers/schema';

export const collections = handleActions({
  'GET_COLLECTIONS_SUCCESS': (state, action) => {
    return fromPairs(action.payload.map(i => [i, {}]));
  },
  'ADD_TO_COLLECTION': (state, action) => {
    const { item, schema, collection } = action.payload;
    const transformed = head(mapSchemaToData(schema, item));

    return {
      ...state,
      [collection]: {
        ...state[collection],
        [item.id]: { ...transformed, socket: { state: 'initializing' } }
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
  'UPDATE_COLLECTION_SOCKET_STATUS': (state, action) => {
    const { status, collection } = action.payload;

    return {
      ...state,
      [collection]: mapValues(state[collection], o => {
        if (o.socket && o.socket.state) o.socket.state = status;
        return o;
      })
    };
  }
}, {});
