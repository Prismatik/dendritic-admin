import React, { Component, createFactory, DOM, PropTypes } from 'react';
import { connect } from 'react-redux';
import form from '../components/form';
import { mapSchemaToFormInputs } from '../lib/transformers/schema';

const Form = createFactory(form);

export class Doc extends Component {
  render() {
    const { schemaProps, doc } = this.props;
    const inputs = mapSchemaToFormInputs(schemaProps, doc);

    return DOM.div({ className: 'section' }, Form(null, inputs));
  }
}

const Connected = connect((state, { params }) => ({
  schemaProps: state.api.schema[params.name].properties,
  doc: state.collections[params.name][params.id]
}));

export default Connected(Doc);
