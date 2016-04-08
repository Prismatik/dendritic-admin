import React, { DOM } from 'react';

export default function TableColumn({ key = 0, children }) {
  return DOM.td({ key }, children)
};
