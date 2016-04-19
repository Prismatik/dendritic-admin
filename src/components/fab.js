import React, { DOM } from 'react';

const Fab = ({ color, title, onClick, children }) => {
  return DOM.a({ href: '#', className: `btn-floating waves-effect waves-light ${color}`, title, onClick},
    DOM.i({ className: 'material-icons' }, children)
  );
};

export default Fab;
