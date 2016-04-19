import React from 'react';
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
      it('must return array', function() {
        const data = Collection.sanitizeData([
          { id: 1, name: 'garry', socket: { state: 'ready' } }
        ]);
        data.must.be.an.array();
      });

      it('must not return item if socket state is not ready', function() {
        const data = Collection.sanitizeData([
          { id: 1, name: 'garry', socket: { state: 'initializing' } },
          { id: 2, name: 'larry', socket: { state: 'ready' } }
        ]);

        data.must.have.length(1);
        data[0].id.must.be(2);
      });

      it('must remove socket property if socket is ready', function() {
        const data = Collection.sanitizeData([
          { id: 1, name: 'garry', socket: { state: 'ready' } }
        ]);
        data[0].must.not.have.property('socket');
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
