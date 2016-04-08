import React, { DOM } from 'react';

export default function TableHeaderColumn({ key, children }) {
  return DOM.th({ key }, children)
};
