import React from 'react';
import TableColumn from '../../src/components/table_column';
import { shallowComponent } from '../react_utils';

describe('./components/table_column', function() {
  describe('.render', function() {
    it('must render correctly', function() {
      const el = <TableColumn>Hey Garry!</TableColumn>;
      const rendered = <td
        key='0'
        className='grey-text text-darken-2'>
        Hey Garry!
      </td>;

      shallowComponent(el).must.be.jsx(rendered);
    });
  });
});
