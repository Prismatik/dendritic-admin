import { form2js } from 'form2js';
import { map } from 'lodash';
import React, { createElement, createFactory, PropTypes } from 'react';
import FormInput from './form_input';
import * as api from '../lib/api';
import { handleNumbers } from '../lib/form2js';
import { mapSchemaToFormInputs } from '../lib/transformers/schema';

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
    const data = form2js(e.target, '.', true, handleNumbers);

    // FIXME check this data against the schema
    api.post(this.props.pluralName, data);
  },

  toggleCreationForm: function() {
    const visState = this.state.creationFormVisible;
    const createButtonText = visState ? 'Create' : 'Hide';
    this.setState({ creationFormVisible: !visState, createButtonText: createButtonText });
  },

  render: function() {
    const toggle = (
      <button
        onClick={this.toggleCreationForm}
        className='waves-effect waves-light btn cyan'
      >
        {this.state.createButtonText}
      </button>
    );

    if (!this.state.creationFormVisible) return toggle;

    return (
      <div>
        <form onSubmit={this.submissionHandler}>
          {map(mapSchemaToFormInputs(this.props.schema), (item, key) =>
            <FormInput
              id={key}
              name={key}
              defaultValue={item.value}
              type={item.type}
              key={key}
            />
          )}
          <button type='submit' className='waves-effect waves-light btn cyan'>
            Submit
          </button>
        </form>
        {toggle}
      </div>
    );
  }
});
