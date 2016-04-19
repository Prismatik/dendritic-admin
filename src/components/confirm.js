import React, { DOM } from 'react';

export default function Confirm({ children, onDone }) {
  const respond = value => {
    return event => {
      event.preventDefault();
      onDone(value);
    };
  };

  return DOM.div({ className: 'dialog' },
    DOM.div({ className: 'modal open' },
      DOM.div({ className: 'modal-content' },
        DOM.h4(null, 'Confirm'),
        DOM.p(null, children || 'Are you sure?')
      ),
      DOM.div({ className: 'modal-footer'},
        DOM.a({ href: '#', onClick: respond(true), className: 'modal-action modal-close waves-effect waves-green btn-flat'}, 'Confirm'),
        DOM.a({ href: '#', onClick: respond(false), className: 'modal-action modal-close waves-effect waves-blue btn-flat'}, 'Cancel')
      )
    ),
    DOM.div({ className: 'lean-overlay' })
  );
};
