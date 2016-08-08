import React, { DOM, PropTypes } from 'react';

export const FormInput = props => {
  return DOM.div({ className: 'input-field' },
    DOM.input({ ...props, placeholder: props.name })
  );
};

FormInput.propTypes = {
  text: PropTypes.string
};

export default FormInput;
