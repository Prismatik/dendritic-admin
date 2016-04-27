import { api } from 'root/src/redux/reducers/api';
import { ValidSchema } from 'root/test/fixtures/valid_schema';
import ValidState, { changefeeds } from 'root/test/fixtures/valid_state';

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
      result.changefeeds.must.eql(changefeeds);
    });
  });
});
