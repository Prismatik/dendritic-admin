import { values } from 'lodash';
import React, {
  Component,
  createFactory,
  DOM,
  PropTypes
} from 'react';
import tc from './table_column';
import thc from './table_header_column';
import tr from './table_row';

const TableColumn = createFactory(tc);
const TableHeaderColumn = createFactory(thc);
const TableRow = createFactory(tr);

export default class Table extends Component {
  getHeaderRow(headers) {
    const columns = headers.map((header, index) => {
      return TableHeaderColumn({ key: index }, header);
    });

    return TableRow({ columns });
  }

  getRows(data) {
    return data.map((row, index) => {
      const columns = values(row).map((column, index) => {
        return TableColumn({ key: index }, column);
      });

      return TableRow({ key: index, columns });
    });
  }

  render() {
    const { name, headers, data } = this.props;

    return DOM.div(null,
      DOM.h3(null, name),
      DOM.table({ className: 'highlight' },
        DOM.thead(null, this.getHeaderRow(headers)),
        DOM.tbody(null, this.getRows(data))
      )
    );
  }
};

Table.propTypes = {
  name: PropTypes.string.isRequired,
  headers: PropTypes.array.isRequired,
  data: PropTypes.array
};

Table.defaultProps = {
  data: []
};
