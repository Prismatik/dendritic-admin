import { createAction } from 'redux-actions';

export const getCollectionsSuccess = createAction('GET_COLLECTIONS_SUCCESS');
export const addToCollection = createAction('ADD_TO_COLLECTION');
export const removeFromCollection = createAction('REMOVE_FROM_COLLECTION');
export const updateCollectionSocketStatus = createAction('UPDATE_COLLECTION_SOCKET_STATUS');
