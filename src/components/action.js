import { omit } from 'lodash';
import React, { createElement, PropTypes } from 'react';
import { Link } from 'react-router';

const Action = (props) => {
  return createElement(Link, {
    ...omit(props, 'path'),
    to: props.path
  }, props.children);
};

Action.propTypes = {
  path: PropTypes.string
};

Action.defaultProps = {
  path: '#',
};

export default Action;
