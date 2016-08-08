import React from 'react';
import Form from '../../src/components/form';
import { Doc, mapStateToProps } from '../../src/containers/doc';
import { shallowComponent } from '../react_utils';
import ValidState from '../fixtures/valid_state';

const state = ValidState();
const { api: { schema } } = state;

describe('./containers/doc', function() {
  describe('Doc', function() {
    describe('.render', function() {
      it('must render correctly', function() {
        const el = <Doc
          schema={schema.sheep}
          doc={{
            id: 'f96c5ca7-4c43-441d-b43b-05b4c683e697',
            name: 'garry'
          }}
        />;

        const rendered = <div className='section'>
          <Form
            inputs={{
              'attributes.color': { pattern: 'white|black', type: 'text' },
              'attributes.size': { pattern: 'small|big', type: 'text' },
              id: { type: 'text', value: 'f96c5ca7-4c43-441d-b43b-05b4c683e697' },
              name: { required: true, type: 'text', value: 'garry' }
            }}
            onSubmit={function() {}}
          />
        </div>;

        shallowComponent(el).must.be.jsx(rendered);
      });
    });
  });

  describe('.mapStateToProps', function() {
    it('must return correct props from state', function() {
      const docs = { 123: { id: 123, name: 'garry' } };
      const newState = { ...state, collections: { sheep: docs } };
      const props = { params: { name: schema.sheep.name, id: 123 } };
      const mapped = mapStateToProps(newState, props);

      mapped.must.eql({
        schema: schema.sheep,
        doc: {
          id: 123,
          name: 'garry'
        }
      });
    });
  });
});
