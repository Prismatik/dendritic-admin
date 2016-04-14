import { toArray } from 'lodash';
import React, { Component, createFactory, DOM } from 'react';
import { connect } from 'react-redux';
import creator from '../components/creator';
import table from '../components/table';
import { extractHeaders } from '../lib/transformers/schema';

const Creator = createFactory(creator);
const Table = createFactory(table);

export class Collection extends Component {
  render() {
    const { schema, apiUrl, collection } = this.props;

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
        data: toArray(collection)
      })
    );
  }
}

const Connected = connect((state, props) => ({
  schema: state.api.schema[props.params.name],
  apiUrl: state.api.url,
  collection: state.collections[props.params.name]
}));

export default Connected(Collection);
