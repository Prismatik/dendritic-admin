import { isString } from 'lodash';
import React, { DOM } from 'react';

export default function TableColumn({ key = 0, children }) {

  // TODO: This is a flimsy way of checking for a link.  Make this more
  // robust.
  // @nwinch 08/04/16
  if (isString(children) && children.match(/^\//)) {
    children = DOM.a({ href: children }, children);
  }

  return DOM.td({ key }, children)
};
