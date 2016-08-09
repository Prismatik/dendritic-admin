import { form2js } from 'form2js';
import { isEqual } from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Form from '../components/form';
import { mapSchemaToFormInputs } from '../lib/transformers/schema';
import * as api from '../lib/api';
import { handleNumbers } from '../lib/form2js';

export class Doc extends React.Component {
  shouldComponentUpdate({ doc }) {
    if (!isEqual(doc, this.props.doc)) return true;
    return false;
  }

  onSubmit(e) {
    e.preventDefault();

    const { schema, doc } = this.props;
    const data = form2js(e.target, '.', true, handleNumbers);
    const path = `${schema.pluralName}/${doc.id}`;

    api.put(path, data);
  }

  render() {
    const { schema, doc } = this.props;

    return <div className='section'>
      <Form
        inputs={mapSchemaToFormInputs(schema, doc)}
        onSubmit={e => this.onSubmit(e)}
      />
    </div>;
  }
}

Doc.propTypes = {
  schema: PropTypes.object.isRequired,
  doc: PropTypes.object
};

export const mapStateToProps = (state, { params: { name, id } }) => ({
  schema: state.api.schema[name],
  doc: state.collections[name][id]
});

export default connect(mapStateToProps)(Doc);
