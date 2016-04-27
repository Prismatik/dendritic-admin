import * as api from '../../lib/api';
import { createAction } from 'redux-actions';

export const getCollectionsSuccess = createAction('GET_COLLECTIONS_SUCCESS');
export const addToCollection = createAction('ADD_TO_COLLECTION');
export const removeFromCollection = createAction('REMOVE_FROM_COLLECTION');
export const updateDocumentChangefeedState = createAction('UPDATE_DOCUMENT_CHANGEFEED_STATE');

// async actions
export const postToCollection = createAsyncAction('ADD_TO_COLLECTION',
  ({ item, collection }) => {
    return api.post(`/${collection}`, item)
      .then(newItem => Object.assign(item, newItem));
  }
);

export const deleteFromCollection = createAsyncAction('REMOVE_FROM_COLLECTION',
  ({ item, collection }) => api.delete(`/${collection}/${item.id}`)
);

/**
 * Creates an async action that handles the transition states/events
 * in a consistent way. SFA compliant, i guess
 *
 * @param {String} event type
 * @param {Function} the actual handler
 */
function createAsyncAction(type, handle) {
  return payload => {
    return dispatch => {
      dispatch({ type: `${type}_SENT`, payload });

      return handle(payload)
        .then(response => dispatch({ type, payload, response }))
        .catch(response => dispatch({ type: `${type}_FAILED`, payload, error: response.data }));
    };
  };
}
