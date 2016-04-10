import React, { DOM, PropTypes } from 'react';

const TableRow = ({ key = 0, columns }) => {
  return DOM.tr({ key }, columns)
};

TableRow.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.element).isRequired
};

export default TableRow;
