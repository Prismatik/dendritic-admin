import { isFunction, values } from 'lodash';
import React, { Component, createElement, DOM, PropTypes } from 'react';
import TableColumn from './table_column';
import TableHeaderColumn from './table_header_column';
import TableRow from './table_row';

export default class Table extends Component {
  render() {
    const { name, headers, data, iterator } = this.props;

    return DOM.div(null,
      DOM.h3(null, name),
      DOM.table({ className: 'highlight' },
        DOM.thead(null, this._getHeaderRow(headers)),
        DOM.tbody(null, this._getRows(data, iterator))
      )
    );
  }

  _getHeaderRow(headers) {
    const columns = headers.map((header, index) => {
      return createElement(TableHeaderColumn, { key: index }, header);
    });
    return createElement(TableRow, { columns });
  }

  _getRows(data, iterator) {
    return data.map((row, index) => {
      const columns = values(row).map((column, index) => {
        const val = isFunction(iterator) ? iterator(column) : column;
        return createElement(TableColumn, { key: index }, val);
      });

      return createElement(TableRow, { key: index, columns });
    });
  }
};

Table.propTypes = {
  name: PropTypes.string.isRequired,
  headers: PropTypes.array.isRequired,
  data: PropTypes.array,
  iterator: PropTypes.func
};

Table.defaultProps = {
  data: []
};
