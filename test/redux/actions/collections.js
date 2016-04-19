import * as actions from 'root/src/redux/actions/collections';

describe('./redux/actions/collections', function() {
  describe('.updateCollectionSocketStatus', function() {
    it('must return type UPDATE_COLLECTION_SOCKET_STATUS', function() {
      const action = actions.updateCollectionSocketStatus({});
      action.type.must.eql('UPDATE_COLLECTION_SOCKET_STATUS');
    });
  });
});
