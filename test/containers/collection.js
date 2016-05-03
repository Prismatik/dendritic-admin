import React from 'react';
import { Link } from 'react-router';
import Creator from 'root/src/components/creator';
import Table from 'root/src/components/table';
import { Collection, mapStateToProps } from 'root/src/containers/collection';
import { extractHeaders } from 'root/src/lib/transformers/schema';
import { shallowComponent } from 'root/test/react_utils';
import ValidState from 'root/test/fixtures/valid_state';

describe('./containers/collection', function() {
  before(function() {
    const state = ValidState();
    const { api: { url, schema } } = state;

    this.state = state;
    this.apiUrl = url;
    this.schema = schema;
  });

  describe('Collection', function() {
    describe('static.sanitizeData', function() {
      it('must not return items that are not state = ready', function() {
        const notReady = { id: 1, name: 'garry', changefeed: { state: 'initializing' } };
        const ready = { id: 2, name: 'larry', changefeed: { state: 'ready' } };
        const sanitized = Collection.sanitizeData([ready, notReady]);

        sanitized.must.not.include(notReady);
      });

      it('must only return items that are state = ready', function() {
        const notReady = { id: 1, name: 'garry', changefeed: { state: 'initializing' } };
        const ready = { id: 2, name: 'larry', changefeed: { state: 'ready' } };
        const sanitized = Collection.sanitizeData([ready, notReady]);

        sanitized.must.eql([{ id: 2, name: 'larry' }]);
      });

      it('must remove changefeed property state = ready items', function() {
        const ready = { id: 1, name: 'garry', changefeed: { state: 'ready' } };
        const sanitized = Collection.sanitizeData([ready]);

        sanitized[0].must.not.have.property('changefeed');
      });
    });

    describe('static.iterator', function() {
      it('must return link if supplied UUID', function() {
        const UUID = '12429635-4c0e-43fb-be41-6fd7aeb89405';
        const el = Collection.iterator('socks', UUID);
        const rendered = <Link
          className='red-text text-accent-4'
          onlyActiveOnIndex={false}
          style={{}}
          to={`/collections/socks/${UUID}`}>
          {UUID}
        </Link>;

        shallowComponent(el).must.be.jsx(rendered);
      });

      it('must render link if supplied URL looking string', function() {
        const url = '/over/here/garry';
        const el = Collection.iterator('socks', url);
        const rendered = <Link
          className='red-text text-accent-4'
          onlyActiveOnIndex={false}
          style={{}}
          to={`/collections${url}`}>
          {url}
        </Link>;

        shallowComponent(el).must.be.jsx(rendered);
      });
    });

    describe('.render', function() {
      it('must render correctly', function() {
        const schema = this.schema.sheep;
        const data = [];

        const el = <Collection
          schema={schema}
          apiUrl={this.apiUrl}
          data={data}
        />;

        const expected = <div className='section'>
          <Creator
            apiUrl={this.apiUrl}
            name={schema.name}
            pluralName={schema.pluralName}
            schema={schema}
          />
          <Table
            data={data}
            headers={extractHeaders(schema.properties)}
            name={schema.pluralName}
            iterator={function(){}}
          />
        </div>;

        shallowComponent(el).must.be.jsx(expected);
      });
    });
  });

  describe('.mapStateToProps', function() {
    it('must return correct props from state', function() {
      const props = { params: { name: this.schema.sheep.name } };
      const mapped = mapStateToProps(this.state, props);
      mapped.must.have.keys(['schema', 'apiUrl', 'data']);
    });
  });
});
