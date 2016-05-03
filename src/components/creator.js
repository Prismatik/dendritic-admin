import { form2js } from 'form2js';
import React, { createElement, createFactory, PropTypes } from 'react';
import * as api from '../lib/api';
import { mapSchemaToFormInputs } from '../lib/transformers/schema';
import Form from './form';

module.exports = React.createClass({
  displayName: 'Creator',

  propTypes: {
    apiUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    pluralName: PropTypes.string.isRequired,
    schema: PropTypes.object.isRequired
  },

  getInitialState: function() {
    return { createButtonText: 'Create' };
  },

  handleNumbers: function(node) {
    if (node.nodeName === 'INPUT' && node.type === 'number') {
      const val = parseInt(node.value);
      if (!val) return false;
      return { name: node.name, value: val };
    };
    return false;
  },

  submissionHandler: function(e) {
    e.preventDefault();
    const data = form2js(e.target, '.', true, this.handleNumbers);

    // FIXME check this data against the schema
    api.post(this.props.pluralName, data);
  },

  toggleCreationForm: function() {
    const visState = this.state.creationFormVisible;
    const createButtonText = visState ? 'Create' : 'Hide';
    this.setState({ creationFormVisible: !visState, createButtonText: createButtonText });
  },

  render: function() {
    const inputs = mapSchemaToFormInputs(this.props.schema);
    const form = this.state.creationFormVisible
      ? createElement(Form, { inputs, onSubmit: this.submissionHandler })
      : null;

    return React.DOM.div(
      { key: this.props.name+'creatorContainer' },
      form,
      React.DOM.button({
        onClick: this.toggleCreationForm,
        key: 'create',
        className: 'waves-effect waves-light btn cyan'
      }, this.state.createButtonText)
    );
  }
});
