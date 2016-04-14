import { isString } from 'lodash';
import React, { createFactory, DOM } from 'react';
import action from './action';

const Action = createFactory(action);

export default function TableColumn({ key = 0, children }) {

  // TODO: This is a flimsy way of checking for a link.  Make this more
  // robust.
  // @nwinch 08/04/16
  if (isString(children) && children.match(/^\//)) {
    children = Action({
      className: 'red-text text-accent-4',
      path: `/collections${children}`,
    }, children);
  }

  return DOM.td({ key, className: 'grey-text text-darken-2' }, children);
};
