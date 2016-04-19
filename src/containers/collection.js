import { toArray } from 'lodash';
import React, { Component, createFactory, createElement, DOM } from 'react';
import { connect } from 'react-redux';
import { removeFromCollection } from '../redux/actions/collections';
import creator from '../components/creator';
import table from '../components/table';
import Fab from '../components/fab';
import Confirm from '../components/confirm';
import { extractHeaders } from '../lib/transformers/schema';

const Creator = createFactory(creator);
const Table = createFactory(table);

export class Collection extends Component {
  render() {
    const { confirm } = this.state || {};
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
      }),
      confirm && createElement(Confirm, {
        onDone: okay => this.closeConfirmDialog(okay)
      }, confirm)
    );
  }

  actionsFor(entry) {
    return DOM.div({ className: 'actions' },
      createElement(Fab, { color: 'green', title: 'Edit the record' }, 'mode_edit'),
      createElement(Fab, { color: 'red', title: 'Delete the record', onClick: e => this.removeItem(e, entry) }, 'delete')
    );
  }

  removeItem(event, entry) {
    const { schema, removeFromCollection } = this.props;

    event.preventDefault();

    this.setState({
      confirm: `Are you sure you want to delete this item?`,
      onDone: okay => okay && removeFromCollection(entry, schema.name)
    });
  }

  closeConfirmDialog(okay) {
    this.state.onDone && this.state.onDone(okay);
    this.setState({ confirm: null, onOkay: null });
  }
}

const Connected = connect((state, props) => ({
  schema: state.api.schema[props.params.name],
  apiUrl: state.api.url,
  collection: state.collections[props.params.name]
}), dispatch => ({
  removeFromCollection: (item, collectionName) => {
    dispatch(removeFromCollection({ item, collection: collectionName }));
  }
}));

export default Connected(Collection);
