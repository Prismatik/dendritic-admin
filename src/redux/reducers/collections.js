import { fromPairs, head, omitBy } from 'lodash';
import { handleActions } from 'redux-actions';
import { transform } from '../../lib/transformers/schema';

export const collections = handleActions({
  'GET_COLLECTIONS_SUCCESS': (state, action) => {
    return fromPairs(action.payload.map(i => [i, {}]));
  },
  'ADD_TO_COLLECTION': (state, action) => {
    const { item, schema, collection } = action.payload;
    const transformed = head(transform(schema, item));

    return {
      ...state,
      [collection]: {
        ...state[collection],
        [item.id]: transformed
      }
    };
  },
  'REMOVE_FROM_COLLECTION': (state, action) => {
    const { item, collection } = action.payload;

    return {
      ...state,
      [collection]: omitBy(state[collection], (val, key) => key == item.id)
    };
  }
}, {});
