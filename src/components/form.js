import { map } from 'lodash';
import React, { Component, createFactory, DOM, PropTypes } from 'react';
import formInput from './form_input';

const FormInput = createFactory(formInput);

export default class Form extends Component {
  render() {
    const { inputs, onSubmit } = this.props;

    return DOM.form({ onSubmit },
      map(inputs, ({ type, value = null }, key) => {
        return FormInput({
          id: key,
          name: key,
          defaultValue: value,
          type,
          key
        });
      }),
      FormInput({
        type: 'submit',
        text: 'Submit',
        className: 'waves-effect waves-light btn cyan'
      })
    );
  }
};

Form.propTypes = {
  inputs: PropTypes.object.isRequired,
  onSubmit: PropTypes.func
};

Form.defaultProps = {
  onSubmit: function() {}
};
