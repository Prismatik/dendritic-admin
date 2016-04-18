import React, { Component, DOM, PropTypes } from 'react';
import { connect } from 'react-redux';

export class Doc extends Component {
  render() {
    return DOM.div({ className: 'section' }, JSON.stringify(this.props.doc));
  }
}

const Connected = connect((state, { params }) => ({
  doc: state.collections[params.name][params.id]
}));

export default Connected(Doc);
