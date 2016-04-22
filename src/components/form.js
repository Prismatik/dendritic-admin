import { map } from 'lodash';
import React, { Component, createFactory, DOM, PropTypes } from 'react';
import formInput from './form_input';

const FormInput = createFactory(formInput);

export default class Form extends Component {
  render() {
    const { children, onSubmit } = this.props;

    return DOM.form({ onSubmit },
      map(children, ({ type, value = null }, key) => {
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
  onSubmit: PropTypes.func
};

Form.defaultProps = {
  onSubmit: function() {}
};
