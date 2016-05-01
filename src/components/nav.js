import React, { createElement, DOM, PropTypes } from 'react';
import Action from './action';
import ListItem from './list_item';

function Nav({ items }) {
  return DOM.nav({ className: 'red lighten-1' },
    DOM.ul({ className: 'left' },
      items.map((item, key) => {
        return createElement(ListItem, { key },
          createElement(Action, {
            className: 'white-text flow-text',
            path: item.path,
          }, item.name)
        );
      })
    )
  );
};

Nav.propTypes = {
  items: PropTypes.array
};

Nav.defaultProps = {
  items: []
};

export default Nav;
