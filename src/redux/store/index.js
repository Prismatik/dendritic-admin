import {
  createStore,
  applyMiddleware,
  combineReducers
} from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { api } from '../reducers/api';
import { collections } from '../reducers/collections';

const logger = createLogger({
  level: 'info',
  collapsed: true,
  duration: true
});

export default applyMiddleware(thunkMiddleware)(
  applyMiddleware(logger)(createStore)
);

export const reducer = combineReducers({
  api,
  collections
});
