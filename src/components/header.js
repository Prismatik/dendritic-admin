import React, { DOM } from 'react';

export default function Header({ children }) {
  return DOM.header({ className: 'red lighten-1' },
    DOM.div({ className: 'row' },
      DOM.div({ className: 'col s12' },
        DOM.div({ className: 'container' },
          DOM.h3({ className: 'white-text' }, children)
        )
      )
    )
  );
};
