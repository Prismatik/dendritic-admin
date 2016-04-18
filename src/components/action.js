import React, { createElement, PropTypes } from 'react';
import { Link } from 'react-router';

const Action = (props) => {
  return createElement(Link, { ...props, to: props.path }, props.children);
};

Action.propTypes = {
  path: PropTypes.string
};

Action.defaultProps = {
  path: '#',
};

export default Action;
