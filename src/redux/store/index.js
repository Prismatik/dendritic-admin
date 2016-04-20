import {
  createStore,
  applyMiddleware,
  combineReducers
} from 'redux';
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise';
import { api } from '../reducers/api';
import { collections } from '../reducers/collections';

const logger = createLogger({
  level: 'info',
  collapsed: true,
  duration: true
});

export default applyMiddleware(logger, promiseMiddleware)(createStore);

export const reducer = combineReducers({
  api,
  collections
});
