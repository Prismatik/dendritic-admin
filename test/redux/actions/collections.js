import * as actions from 'root/src/redux/actions/collections';
import { mockApi, mockStore } from 'root/test/mock_store';

describe('./redux/actions/collections', function() {
  describe('.updateCollectionSocketStatus', function() {
    it('must return type UPDATE_COLLECTION_SOCKET_STATUS', function() {
      const action = actions.updateCollectionSocketStatus({});
      action.type.must.eql('UPDATE_COLLECTION_SOCKET_STATUS');
    });

    it('must return input as payload property', function() {
      const input = { id: 1, name: 'garry' };
      const action = actions.updateCollectionSocketStatus(input);
      action.payload.must.eql(input);
    });
  });

  describe('postToCollection({ item, collection })', function() {
    it('handles the good path well', function() {
      mockApi.post('/rockets', {name: 'blah!'}).reply(201, {id: 234, name: 'blah!'});
      const payload = { item: {name: 'blah!'}, collection: 'rockets' };
      const store = mockStore({});

      return store.dispatch(actions.postToCollection(Object.assign({}, payload)))
        .then(() => store.getActions()).must.resolve.to.eql([
          { type: 'ADD_TO_COLLECTION_SENT', payload },
          {
            type: 'ADD_TO_COLLECTION',
            payload: {
              item: {id: 234, name: 'blah!'},
              collection: 'rockets'
            },
            response: {id: 234, name: 'blah!'}
          }
        ]);
    });

    it('handles API failures gracefully', function() {
      mockApi.post('/rockets', {name: 'blah!'}).reply(422, {sorry: 'mate'});
      const payload = { item: {name: 'blah!'}, collection: 'rockets' };
      const store = mockStore({});

      return store.dispatch(actions.postToCollection(Object.assign({}, payload)))
        .then(() => store.getActions()).must.resolve.to.eql([
          { type: 'ADD_TO_COLLECTION_SENT', payload },
          { type: 'ADD_TO_COLLECTION_FAILED', payload, error: {sorry: 'mate'} }
        ]);
    });
  });

  describe('deleteFromCollection({ item, collection })', function() {
    const payload = {
      item: {id: 123},
      collection: 'rockets'
    };

    it('handles a good case nicely', function() {
      mockApi.delete('/rockets/123').reply(200, {ok: true});
      const store = mockStore({});

      return store.dispatch(actions.deleteFromCollection(payload))
        .then(() => store.getActions()).must.resolve.to.eql([
          { type: 'REMOVE_FROM_COLLECTION_SENT', payload },
          { type: 'REMOVE_FROM_COLLECTION', payload, response: {ok: true}}
        ]);
    });

    it('handles failures properly as well', function() {
      mockApi.delete('/rockets/123').reply(404, {not: 'found'});
      const store = mockStore({});

      return store.dispatch(actions.deleteFromCollection(payload))
        .then(() => store.getActions()).must.resolve.to.eql([
          { type: 'REMOVE_FROM_COLLECTION_SENT', payload },
          { type: 'REMOVE_FROM_COLLECTION_FAILED', payload, error: {not: 'found'}}
        ]);
    });
  });
});
