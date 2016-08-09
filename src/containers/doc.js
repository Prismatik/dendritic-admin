import { form2js } from 'form2js';
import { isEqual, map } from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { hashHistory as history } from 'react-router';
import FormInput from '../components/form_input';
import { mapSchemaToFormInputs } from '../lib/transformers/schema';
import * as api from '../lib/api';
import { handleNumbers } from '../lib/form2js';
import { getByPlural } from '../lib/schema';
import { deleteFromCollection } from '../redux/actions/collections';

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

  onRemove(e) {
    e.preventDefault();

    const collection = this.props.schema.pluralName;

    this.props.removeAction({
      item: { id: this.props.doc.id },
      collection
    }).then(() => history.replace(`/collections/${collection}`));
  }

  render() {
    const { schema, doc } = this.props;

    return <div className='section'>
      <form onSubmit={e => this.onSubmit(e)}>
        {map(mapSchemaToFormInputs(schema, doc), (item, key) =>
          <FormInput
            id={key}
            name={key}
            defaultValue={item.value}
            type={item.type}
            key={key}
          />
        )}
        <button
          type='submit'
          className='waves-effect waves-light btn cyan'
          style={{ marginRight: '5px' }}
        >
          Update
        </button>
        <button
          type='submit'
          className='waves-effect waves-light btn red darken-2'
          onClick={e => this.onRemove(e)}
        >
          Remove
        </button>
      </form>
    </div>;
  }
}

Doc.propTypes = {
  schema: PropTypes.object.isRequired,
  doc: PropTypes.object
};

export const mapStateToProps = (state, { params: { name, id } }) => ({
  schema: getByPlural(state.api.schema, name),
  doc: state.collections[name][id]
});

export const mapDispatchToProps = dispatch =>
  ({ removeAction: data => dispatch(deleteFromCollection(data)) });

export default connect(mapStateToProps, mapDispatchToProps)(Doc);
