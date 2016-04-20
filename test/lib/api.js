import * as api from 'root/src/lib/api';
import config from 'root/config';
import nock from 'nock';

const DUMMY_HOST = 'http://dummy.com';
const mock = nock(DUMMY_HOST);

describe.only('API connection pipe', () => {
  beforeEach(() => {
    config.apiUrl = DUMMY_HOST;
    nock.cleanAll();
  });

  describe('#get(path)', () => {
    it('gets things from the host', done => {
      mock.get('/some/url').reply(200, {some: 'data'});

      api.get('/some/url').then(data => {
        data.must.eql({some: 'data'});
        done();
      })
      .catch(done);
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

  describe('#post(path, data)', () => {
    it('posts things and yields responses back', done => {
      mock.post('/some/url', {some: 'data'}).reply(201, {ok: true});
      api.post('/some/url', {some: 'data'})
        .then(result => result.must.eql({ok: true}))
        .then(done).catch(done);
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

  describe('#put(path, data)', () => {
    it('posts things and yields responses back', done => {
      mock.put('/some/url', {some: 'data'}).reply(200, {ok: true});
      api.put('/some/url', {some: 'data'})
        .then(result => result.must.eql({ok: true}))
        .then(done).catch(done);
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

  describe('#delete(path)', () => {
    it('deletes things from the host', done => {
      mock.delete('/some/url').reply(200, {ok: true});

      api.delete('/some/url').then(data => {
        data.must.eql({ok: true});
        done();
      })
      .catch(done);
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
