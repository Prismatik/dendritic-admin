import React, { DOM } from 'react';

const Fab = ({ color, children }) => {
  return DOM.a({ href: '#', className: `btn-floating waves-effect waves-light ${color}`},
    DOM.i({ className: 'material-icons' }, children)
  );
};

export default Fab;
