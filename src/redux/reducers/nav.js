import { handleActions } from 'redux-actions';

export const nav = handleActions({
  'SET_NAV_ACTIVE': (state, action) => ({
    active: action.payload
  })
}, {
  active: ''
});
