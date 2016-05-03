import { isEqual } from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Form from '../components/form';
import { mapSchemaToFormInputs } from '../lib/transformers/schema';

export class Doc extends React.Component {
  shouldComponentUpdate({ doc }) {
    if (!isEqual(doc, this.props.doc)) return true;
    return false;
  }

  render() {
    const { schema, doc } = this.props;

    return <div className='section'>
      <Form inputs={mapSchemaToFormInputs(schema, doc)} />
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
