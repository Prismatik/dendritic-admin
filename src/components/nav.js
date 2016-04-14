import React, { Component, createFactory, DOM, PropTypes } from 'react';
import action from './action';
import listItem from './list_item';

const Action = createFactory(action);
const ListItem = createFactory(listItem);

export default class Nav extends Component {
  render() {
    const { items } = this.props;

    return DOM.ul(null,
      items.map((item, key) => {
        return ListItem({ key },
          Action({
            className: 'red-text text-accent-4 flow-text',
            path: `/collections/${item}`,
          }, item)
        );
      })
    );
  }
};

Nav.propTypes = {
  items: PropTypes.array
};

Nav.defaultProps = {
  items: []
};
