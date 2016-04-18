import React, { createFactory, DOM } from 'react';
import action from './action';

const Action = createFactory(action);

export default function Header() {
  return DOM.header({ className: 'red lighten-1' },
    DOM.div({ className: 'row' },
      DOM.div({ className: 'col s12' },
        DOM.div({ className: 'container' },
          DOM.h3({ className: 'white-text' },
            Action({ path: '/', className: 'white-text' }, 'Redbeard Admin')
          )
        )
      )
    )
  );
};
