import React from 'react';
import { Doc, mapStateToProps } from '../../src/containers/doc';
import { shallowComponent } from '../react_utils';
import ValidState from '../fixtures/valid_state';

const state = ValidState();
const { api: { schema } } = state;

describe('./containers/doc', function() {
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
