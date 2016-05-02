import { capitalize } from 'lodash';
import React, { createElement, DOM, PropTypes } from 'react';
import Action from './action';
import Nav from './nav';

function Header({ collections }) {
  const home = [{ path: '/', name: 'Home' }];
  const navItems = home.concat(collections.map(item => ({
    path: `/collections/${item}`,
    name: capitalize(item)
  })));

  return DOM.header({ className: 'red lighten-1' },
    DOM.div({ className: 'row' },
      DOM.div({ className: 'col s12' },
        DOM.div({ className: 'container' },
          createElement(Nav, { items: navItems })
        )
      )
    )
  );
};

Header.propTypes = {
  collections: PropTypes.array
};

Header.defaultProps = {
  collections: []
};

export default Header;
