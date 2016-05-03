import React, { DOM } from 'react';

export default function TableColumn({ key = 0, children }) {
  return DOM.td({ key, className: 'grey-text text-darken-2' }, children);
};
