import { capitalize } from 'lodash';
import React, { DOM } from 'react';

export default function TableHeaderColumn({ key = 0, children }) {
  return DOM.th({ key }, capitalize(children));
};
