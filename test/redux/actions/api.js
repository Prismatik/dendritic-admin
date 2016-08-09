import * as actions from '../../../src/redux/actions/api';

describe('./redux/actions/api', function() {
  describe('.getApiSuccess', function() {
    it('must return type GET_API_SUCCESS', function() {
      const action = actions.getApiSuccess({});
      action.type.must.eql('GET_API_SUCCESS');
    });
  });

  describe('.updateApiChangefeedState', function() {
    it('must return type UPDATE_API_CHANGEFEED_STATE', function() {
      const action = actions.updateApiChangefeedState({});
      action.type.must.eql('UPDATE_API_CHANGEFEED_STATE');
    });
  });
});
