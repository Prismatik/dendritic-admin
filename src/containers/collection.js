import { isEqual, omit, reduce, toArray } from 'lodash';
import React, { Component, createFactory, DOM, PropTypes } from 'react';
import { connect } from 'react-redux';
import creator from '../components/creator';
import table from '../components/table';
import { extractHeaders } from '../lib/transformers/schema';

const Creator = createFactory(creator);
const Table = createFactory(table);

export class Collection extends Component {
  static sanitizeData(data) {
    return toArray(reduce(data, (result, value, key) => {
      if (value.changefeed.state === 'ready') result[key] = omit(value, 'changefeed');
      return result;
    }, {}));
  }

  shouldComponentUpdate({ data }) {
    if (!isEqual(data, this.props.data)) return true;
    return false;
  }

  render() {
    const { schema, apiUrl, data } = this.props;

    return DOM.div({ className: 'section' },
      Creator({
        name: schema.name,
        pluralName: schema.pluralName,
        apiUrl,
        schema
      }),
      Table({
        name: schema.pluralName,
        headers: extractHeaders(schema.properties),
        data
      })
    );
  }
}

Collection.propTypes = {
  schema: PropTypes.object.isRequired,
  apiUrl: PropTypes.string.isRequired,
  data: PropTypes.array
};

Collection.defaultProps = {
  data: []
};

export function mapStateToProps(state, { params: { name } }) {
  return {
    schema: state.api.schema[name],
    apiUrl: state.api.url,
    data: Collection.sanitizeData(state.collections[name])
  };
}

export default connect(mapStateToProps)(Collection);
