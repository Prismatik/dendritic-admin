import React, { Component, createFactory, DOM, PropTypes } from 'react';
import listItem from './list_item';

const ListItem = createFactory(listItem);

export default class Nav extends Component {
  render() {
    const { items, itemOnClick } = this.props;

    return DOM.ul(null,
      items.map((item, key) => {
        return ListItem({ key },
          DOM.a({
            href: '#',
            onClick: e => itemOnClick(e, item)
          }, item)
        );
      })
    );
  }
};

Nav.propTypes = {
  items: PropTypes.array,
  itemOnClick: PropTypes.func
};

Nav.defaultProps = {
  items: [],
  itemOnClick: () => {}
};
