import { handleActions } from 'redux-actions';

export const api = handleActions({
  'GET_API_SUCCESS': (state, action) => ({
    ...state,
    schema: action.payload
  })
}, {
  url: '',
  schema: {}
});
