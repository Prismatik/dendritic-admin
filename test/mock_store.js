import nock from 'nock';
import thunk from 'redux-thunk';
import createStore from 'redux-mock-store';
import config from 'root/config';

const DUMMY_HOST = 'http://dummy.com';

export const mockApi   = nock(DUMMY_HOST);
export const mockStore = createStore([ thunk ]);

beforeEach(() => {
  config.apiUrl = DUMMY_HOST;
  nock.cleanAll();
});
