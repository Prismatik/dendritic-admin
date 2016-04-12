import { fromPairs } from 'lodash';
import { handleActions } from 'redux-actions';

export const collections = handleActions({
  'GET_COLLECTIONS_SUCCESS': (state, action) => {
    return fromPairs(action.payload.map(i => [i, {}]));
  }
}, {});
