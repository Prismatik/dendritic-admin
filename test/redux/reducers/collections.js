import { cloneDeep } from 'lodash';
import { collections } from 'root/src/redux/reducers/collections';
import schema from 'root/test/valid_api_schema.json';

const ValidApiSchema = cloneDeep(schema);

describe('./redux/reducers/collections', function() {
  beforeEach(function() {
    this.initialState = {
      sheep: {
        '1': { id: '1', name: 'garry' },
        '3': { id: '3', name: 'doug' }
      },
      wolf: {
        '2': { id: '2', name: 'barry', sheep: '3' }
      }
    };
  });

  describe('ADD_TO_COLLECTION', function() {
    beforeEach(function() {
      this.action = {
        type: 'ADD_TO_COLLECTION',
        payload: { schema: ValidApiSchema.wolf }
      };
    });

    it('must not interfere with other collections', function() {
      this.action.payload = {
        ...this.action.payload,
        collection: 'wolf',
        item: { id: 3, name: 'larry', sheep: 1 }
      };

      const result = collections(this.initialState, this.action);
      result.sheep.must.eql(this.initialState.sheep);
    });

    it('must not interfere with items from collection', function() {
      this.action.payload = {
        ...this.action.payload,
        collection: 'wolf',
        item: { id: 3, name: 'larry', sheep: 1 }
      };

      const result = collections(this.initialState, this.action);
      result.wolf['2'].must.exist();
    });

    it('must add item to collection', function() {
      this.action.payload = {
        ...this.action.payload,
        collection: 'wolf',
        item: { id: 3, name: 'larry', sheep: 1 }
      };

      const result = collections(this.initialState, this.action);
      result.wolf['3'].must.eql({
        id: 3,
        name: 'larry',
        sheep: '/sheep/1',
        socket: { state: 'initializing' }
      });
    });
  });

  describe('REMOVE_FROM_COLLECTION', function() {
    beforeEach(function() {
       this.action = { type: 'REMOVE_FROM_COLLECTION' };
    });

    it('must not remove items from other collections', function() {
      this.action.payload = { collection: 'sheep', item: { id: 1 } };

      const result = collections(this.initialState, this.action);
      result.wolf.must.eql(this.initialState.wolf);
    });

    it('must not remove incorrect item from collection', function() {
      this.action.payload = { collection: 'sheep', item: { id: 1 } };

      const result = collections(this.initialState, this.action);
      result.sheep.must.have.keys(['3']);
    });

    it('must remove item from collection', function() {
      this.action.payload = { collection: 'sheep', item: { id: 1 } };

      const result = collections(this.initialState, this.action);
      result.sheep.must.not.have.keys(['1']);
    });
  });

  describe('UPDATE_COLLECTION_SOCKET_STATUS', function() {
    beforeEach(function() {
       this.action = { type: 'UPDATE_COLLECTION_SOCKET_STATUS' };
    });

    it('must not leave documents with initializing state', function() {
      let state = cloneDeep(this.initialState);
      state.sheep['1'].socket = { state: 'initializing' };

      this.action.payload = {
        collection: 'sheep',
        status: 'ready'
      };

      const result = collections(state, this.action);
      result.sheep['1'].socket.state.must.not.be('initializing');
    });

    it('must update collection with socket state', function() {
      let state = cloneDeep(this.initialState);
      state.sheep['1'].socket = { state: 'initializing' };

      this.action.payload = {
        collection: 'sheep',
        status: 'ready'
      };

      const result = collections(state, this.action);
      result.sheep['1'].socket.state.must.be('ready');
    });
  });
});
