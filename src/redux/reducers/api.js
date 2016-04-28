import { fromPairs, map } from 'lodash';
import { handleActions } from 'redux-actions';

export const api = handleActions({
  'GET_API_SUCCESS': (state, action) => {
    const initial = { state: 'initializing' };
    const iterator = i => [state.url + '/' + i.pluralName, initial];

    return {
      ...state,
      schema: action.payload,
      changefeeds: fromPairs(map(action.payload, iterator))
    };
  },
  'UPDATE_API_CHANGEFEED_STATE': (state, action) => {
    const { status, host } = action.payload;

    return {
      ...state,
      changefeeds: {
        ...state.changefeeds,
        [host]: { state: status }
      }
    };
  }
}, {
  url: '',
  schema: {},
  changefeeds: {}
});
