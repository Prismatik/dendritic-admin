import { form2js } from 'form2js';
import React, { createFactory, PropTypes } from 'react';
import formInput from './form_input';

const FormInput = createFactory(formInput);

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

  calculateInputs: function(properties, lineage, required) {
    if (!lineage) lineage = [];
    const parent = lineage[lineage.length - 1];
    const key = parent || this.props.name;

    const inputs =  Object.keys(properties).reduce((r, prop) => {
      const property = properties[prop];
      if (property.type === 'object') {
        const newLineage = JSON.parse(JSON.stringify(lineage));
        newLineage.push(prop);
        r.push(this.calculateInputs(property.properties, newLineage, property.required));
        return r;
      }

      const numberish = (property.type === 'number' || property.type === 'integer');
      const type = numberish ? 'number' : 'text';
      const isRequired = required && (required.indexOf(prop) > -1);
      const fullName = lineage.length ? lineage.join('.')+'.'+prop : prop;
      r.push(FormInput({
        id: prop,
        key: prop + 'input',
        type: type,
        required: isRequired,
        name: fullName
      }));

      return r;
    }, []);
    return React.DOM.div(
      { key: key+'fieldset' },
      React.DOM.h5({ key: key+'legend' }, 'Create new ' + key),
      inputs
    );
  },

  postData: function(data) {
    fetch(this.props.apiUrl+'/'+this.props.pluralName, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
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
    this.postData(data);
  },

  toggleCreationForm: function() {
    const visState = this.state.creationFormVisible;
    const createButtonText = visState ? 'Create' : 'Hide';
    this.setState({ creationFormVisible: !visState, createButtonText: createButtonText });
  },

  render: function() {
    const fieldsets = this.calculateInputs(this.props.schema.properties, null, this.props.schema.required);

    const form = this.state.creationFormVisible ? React.DOM.form(
      {
        key: this.props.name+'creator',
        onSubmit: this.submissionHandler
      },
      fieldsets,
      FormInput({
        type: 'submit',
        key: this.props.name+'submit',
        text: 'Submit',
        className: 'waves-effect waves-light btn cyan'
      })
    ) : null;

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
