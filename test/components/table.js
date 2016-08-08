import React from 'react';
import Table from '../../src/components/table';
import TableColumn from '../../src/components/table_column';
import TableHeaderColumn from '../../src/components/table_header_column';
import TableRow from '../../src/components/table_row';
import { shallowComponent } from '../react_utils';

describe('./components/table', function() {
  describe('.render', function() {
    it('must render correctly', function() {
      const el = <Table
        name='garry'
        headers={['trousers', 'shoes']}
        data={[{ trousers: 'red', shoes: 'nike' }]}
      />;

      const rendered = <div>
        <h3>garry</h3>
        <table className='highlight'>
          <thead>
            <TableRow columns={[
              <TableHeaderColumn key='0'>trousers</TableHeaderColumn>,
              <TableHeaderColumn key='1'>shoes</TableHeaderColumn>
              ]} />
          </thead>
          <tbody>
            <TableRow columns={[
              <TableColumn key='0'>red</TableColumn>,
              <TableColumn key='1'>nike</TableColumn>
            ]} />
          </tbody>
        </table>
      </div>;

      shallowComponent(el).must.be.jsx(rendered);
    });

    it('must use iterator function on data', function() {
      const el = <Table
        name='garry'
        headers={['trousers', 'shoes']}
        data={[{ trousers: 'red', shoes: 'nike' }]}
        iterator={val => 'nope ' + val}
      />;

      const rendered = <div>
        <h3>garry</h3>
        <table className='highlight'>
          <thead>
            <TableRow columns={[
              <TableHeaderColumn key='0'>trousers</TableHeaderColumn>,
              <TableHeaderColumn key='1'>shoes</TableHeaderColumn>
              ]} />
          </thead>
          <tbody>
            <TableRow columns={[
              <TableColumn key='0'>nope red</TableColumn>,
              <TableColumn key='1'>nope nike</TableColumn>
            ]} />
          </tbody>
        </table>
      </div>;

      shallowComponent(el).must.be.jsx(rendered);
    });
  });
});
