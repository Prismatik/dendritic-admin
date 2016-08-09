import * as api from '../../src/lib/api';
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
      mock.get('/some/url').reply(200, { some: 'data' });
      return api.get('/some/url').must.resolve.to.eql({ some: 'data' });
    });

    it('handles cases when things don\'t go so well on the other end', () => {
      mock.get('/some/url').reply(404, { sorry: 'mate' });
      return api.get('/some/url')
        .catch(error => {
          error.response.status.must.eql(404);
          error.response.data.must.eql({ sorry: 'mate' });
        });
    });
  });

  describe('.post(path, data)', () => {
    it('posts things and yields responses back', () => {
      mock.post('/some/url', { some: 'data' }).reply(201, { ok: true });
      return api.post('/some/url', { some: 'data' }).must.resolve.to.eql({ ok: true });
    });

    it('recovers from the other side failures', () => {
      mock.post('/some/url', { some: 'data' }).reply(422, { validation: 'failed' });
      return api.post('/some/url', { some: 'data' })
        .catch(error => {
          error.response.status.must.eql(422);
          error.response.data.must.eql({ validation: 'failed' });
        });
    });
  });

  describe('.put(path, data)', () => {
    it('posts things and yields responses back', () => {
      mock.put('/some/url', { some: 'data' }).reply(200, { ok: true });
      return api.put('/some/url', { some: 'data' }).must.resolve.to.eql({ ok: true });
    });

    it('recovers from the other side failures', () => {
      mock.put('/some/url', { some: 'data' }).reply(422, { validation: 'failed' });
      return api.put('/some/url', { some: 'data' })
        .catch(error => {
          error.response.status.must.eql(422);
          error.response.data.must.eql({ validation: 'failed' });
        });
    });
  });

  describe('.delete(path)', () => {
    it('deletes things from the host', () => {
      mock.delete('/some/url').reply(200, { ok: true });

      return api.delete('/some/url').must.resolve.to.eql({ ok: true });
    });

    it('handles cases when things don\'t go so well on the other end', () => {
      mock.delete('/some/url').reply(404, { sorry: 'mate' });
      return api.delete('/some/url')
        .catch(error => {
          error.response.status.must.eql(404);
          error.response.data.must.eql({ sorry: 'mate' });
        });
    });
  });
});
