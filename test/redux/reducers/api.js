import { api } from 'root/src/redux/reducers/api';
import { ValidSchema } from 'root/test/fixtures/valid_schema';
import ValidState, { url } from 'root/test/fixtures/valid_state';

describe('./redux/reducers/api', function() {
  describe('GET_API_SUCCESS', function() {
    beforeEach(function() {
      this.action = {
        type: 'GET_API_SUCCESS',
        payload: ValidSchema
      };
    });

    it('must not leave schema state as default', function() {
      const result = api(ValidState().api, this.action);
      result.schema.must.not.eql('');
    });

    it('must set schema state', function() {
      const result = api(ValidState().api, this.action);
      result.schema.must.eql(ValidSchema);
    });

    it('must not leave changefeeds state empty', function() {
      const result = api(ValidState().api, this.action);
      result.changefeeds.must.not.be.empty();
    });

    it('must set changefeeds state', function() {
      const result = api(ValidState().api, this.action);
      result.changefeeds.must.eql({
        [`${url}/sheep`]: { state: 'initializing' },
        [`${url}/wolves`]: { state: 'initializing' }
      });
    });
  });

  describe('UPDATE_API_CHANGEFEED_STATE', function() {
    beforeEach(function() {
      this.action = {
        type: 'UPDATE_API_CHANGEFEED_STATE',
        payload: { host: `${url}/sheep` }
      };
    });

    it('must not touch incorrect changefeed', function() {
      const result = api(ValidState().api, this.action);
      const untouched = `${url}/wolves`;
      const initial = ValidState().api.changefeeds[untouched];

      result.changefeeds[untouched].must.eql(initial);
    });

    it('must update changefeed state to ready', function() {
      const state = 'ready';
      this.action.payload.status = state;

      const result = api(ValidState().api, this.action);
      const changed = `${url}/sheep`;

      result.changefeeds[changed].must.eql({ state });
    });
  });
});
