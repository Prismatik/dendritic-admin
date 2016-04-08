import React, { DOM } from 'react';

export default function TableColumn({ key, children }) {
  return DOM.td({ key }, children)
};
