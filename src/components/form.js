import { map } from 'lodash';
import React, { Component, createFactory, DOM, PropTypes } from 'react';
import formInput from './form_input';

const FormInput = createFactory(formInput);

export default class Form extends Component {
  render() {
    return DOM.form(null,
      map(this.props.children, ({ type, value = null }, key) => {
        return FormInput({
          id: key,
          name: key,
          defaultValue: value,
          type,
          key
        });
      })
    );
  }
};
