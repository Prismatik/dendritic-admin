import { toArray } from 'lodash';
import React, { Component, createFactory, createElement, DOM } from 'react';
import { connect } from 'react-redux';
import creator from '../components/creator';
import table from '../components/table';
import { extractHeaders } from '../lib/transformers/schema';
import Fab from '../components/fab';

const Creator = createFactory(creator);
const Table = createFactory(table);

export class Collection extends Component {
  render() {
    const { schema, apiUrl, collection } = this.props;
    const collectionWithActions = toArray(collection).map(entry => {
      return { ...entry, '': this.actionsFor(entry) };
    });

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
        data: collectionWithActions
      })
    );
  }

  actionsFor(entry) {
    return DOM.div({ className: 'actions' },
      createElement(Fab, { color: 'green' }, 'mode_edit'),
      createElement(Fab, { color: 'red' }, 'delete')
    );
  }
}

const Connected = connect((state, props) => ({
  schema: state.api.schema[props.params.name],
  apiUrl: state.api.url,
  collection: state.collections[props.params.name]
}));

export default Connected(Collection);
