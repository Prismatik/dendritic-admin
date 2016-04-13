import React, { DOM } from 'react';

export default function ListItem({ key = 0, children }) {
  return DOM.li({ key }, children);
};
