import * as api from 'root/src/lib/api';
import config from 'root/config';
import nock from 'nock';

const DUMMY_HOST = 'http://dummy.com';
const mock = nock(DUMMY_HOST);

describe('./lib/api', () => {
  beforeEach(() => {
    config.apiUrl = DUMMY_HOST;
    nock.cleanAll();
  });

  describe('.get(path)', () => {
    it('gets things from the host', () => {
      mock.get('/some/url').reply(200, {some: 'data'});
      return api.get('/some/url').must.resolve.to.eql({some: 'data'});
    });

    it('handles cases when things don\'t go so well on the other end', done => {
      mock.get('/some/url').reply(404, {sorry: 'mate'});
      api.get('/some/url')
        .then(data => done(`Call must reject, instead got: ${data}`))
        .catch(error => {
          error.status.must.eql(404);
          error.data.must.eql({sorry: 'mate'});
        })
        .then(done).catch(done);
    });
  });

  describe('.post(path, data)', () => {
    it('posts things and yields responses back', () => {
      mock.post('/some/url', {some: 'data'}).reply(201, {ok: true});
      return api.post('/some/url', {some: 'data'}).must.resolve.to.eql({ok: true});
    });

    it('recovers from the other side failures', done => {
      mock.post('/some/url', {some: 'data'}).reply(422, {validation: 'failed'});
      api.post('/some/url', {some: 'data'})
        .then(data => done(`Call must reject, instead got: ${data}`))
        .catch(error => {
          error.status.must.eql(422);
          error.data.must.eql({validation: 'failed'});
        })
        .then(done).catch(done);
    });
  });

  describe('.put(path, data)', () => {
    it('posts things and yields responses back', () => {
      mock.put('/some/url', {some: 'data'}).reply(200, {ok: true});
      return api.put('/some/url', {some: 'data'}).must.resolve.to.eql({ok: true});
    });

    it('recovers from the other side failures', done => {
      mock.put('/some/url', {some: 'data'}).reply(422, {validation: 'failed'});
      api.put('/some/url', {some: 'data'})
        .then(data => done(`Call must reject, instead got: ${data}`))
        .catch(error => {
          error.status.must.eql(422);
          error.data.must.eql({validation: 'failed'});
        })
        .then(done).catch(done);
    });
  });

  describe('.delete(path)', () => {
    it('deletes things from the host', () => {
      mock.delete('/some/url').reply(200, {ok: true});

      return api.delete('/some/url').must.resolve.to.eql({ok: true});
    });

    it('handles cases when things don\'t go so well on the other end', done => {
      mock.delete('/some/url').reply(404, {sorry: 'mate'});
      api.delete('/some/url')
        .then(data => done(`Call must reject, instead got: ${data}`))
        .catch(error => {
          error.status.must.eql(404);
          error.data.must.eql({sorry: 'mate'});
        })
        .then(done).catch(done);
    });
  });
});
