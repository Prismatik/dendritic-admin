import { filter, flow, map } from 'lodash';
import React, { Component, createFactory, DOM, PropTypes } from 'react';
import { connect } from 'react-redux';
import { resolve } from 'react-resolver';
import header from '../components/header';
import nav from '../components/nav';
import listener from '../components/socket_listener';
import * as api from '../lib/api';
import {
  getApiSuccess,
  updateApiChangefeedState
} from '../redux/actions/api';
import {
  getCollectionsSuccess,
  addToCollection,
  removeFromCollection,
  updateDocumentChangefeedState
} from '../redux/actions/collections';

const Header = createFactory(header);
const Nav = createFactory(nav);

export class Main extends Component {
  render() {
    const {
      collections,
      children
    } = this.props;

    return DOM.div(null,
      Header({ collections: Object.keys(collections) }),
      DOM.main(null,
        DOM.div({ className: 'row' },
          DOM.div({ className: 'container' },
            DOM.div({ className: 'col s12' }, children)
          )
        )
      )
    );
  }
};

Main.propTypes = {
  api: PropTypes.object.isRequired,
  collections: PropTypes.object.isRequired
};

const Connected = connect(state => ({
  api: state.api,
  collections: state.collections
}));

const Resolved = resolve('init', ({ api: stateApi, dispatch }) => {
  if (stateApi.schema) return;

  return api.get('/schema').then(json => {
    const schemas = map(filter(json, (i, k) => k !== 'definitions'), 'pluralName');
    dispatch(getApiSuccess(json));
    dispatch(getCollectionsSuccess(schemas));
  });
});

function update(collection, host, getState, dispatch, data) {
  const { api } = getState();

  dispatch(removeFromCollection({
    item: data,
    collection
  }));
  dispatch(addToCollection({
    schema: api.schema[collection],
    status: api.changefeeds[host].state,
    item: data,
    collection
  }));
}

function create(collection, host, getState, dispatch, data) {
  const { api } = getState();

  dispatch(addToCollection({
    schema: api.schema[collection],
    status: api.changefeeds[host].state,
    item: data,
    collection
  }));
}

function stateEvent(collection, host, getState, dispatch, data) {
  dispatch(updateApiChangefeedState({ status: 'ready', host }));
  dispatch(updateDocumentChangefeedState({ status: 'ready', collection }));
}

const SocketListener = listener(({ api: { url, schema }, collections }) => {
  return Object.keys(collections).map(collection => {
    const host = `${url}/${schema[collection].pluralName}`;

    return {
      host: host,
      events: [{
        name: 'existed',
        handler: create.bind(null, collection, host)
      }, {
        name: 'created',
        handler: create.bind(null, collection, host)
      }, {
        name: 'updated',
        handler: update.bind(null, collection, host)
      }, {
        name: 'all:loaded',
        handler: stateEvent.bind(null, collection, host)
      }]
    };
  });
});

export default flow(SocketListener, Resolved, Connected)(Main);
