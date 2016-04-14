import React, { DOM } from 'react';

export default function FormInput(props) {
  return DOM.div({ className: 'input-field' },
    DOM.input({ ...props, placeholder: props.name })
  )
};
