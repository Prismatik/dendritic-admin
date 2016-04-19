import { isEqual, omit, reduce, toArray } from 'lodash';
import React, { Component, createFactory, DOM } from 'react';
import { connect } from 'react-redux';
import creator from '../components/creator';
import table from '../components/table';
import { extractHeaders } from '../lib/transformers/schema';

const Creator = createFactory(creator);
const Table = createFactory(table);

export class Collection extends Component {
  static sanitizeData(data) {
    return toArray(reduce(data, (result, value, key) => {
      if (value.socket.state === 'ready') result[key] = omit(value, 'socket');
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

export function mapStateToProps(state, { params: { name } }) {
  return {
    schema: state.api.schema[name],
    apiUrl: state.api.url,
    data: Collection.sanitizeData(state.collections[name])
  };
}

export default connect(mapStateToProps)(Collection);
