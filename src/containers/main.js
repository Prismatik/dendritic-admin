import { flow } from 'lodash';
import React, { Component, createFactory, DOM, PropTypes } from 'react';
import { connect } from 'react-redux';
import { resolve } from 'react-resolver';
import header from '../components/header';
import nav from '../components/nav';
import listener from '../components/socket_listener';
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
      Header(),
      DOM.main(null,
        DOM.div({ className: 'row' },
          DOM.div({ className: 'container' },
            DOM.div({ className: 'col s12 l2' },
              Nav({ items: Object.keys(collections) })
            ),
            DOM.div({ className: 'col s12 l10' },
              children
            )
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

const Resolved = resolve('init', ({ api, dispatch }) => {
  if (api.schema) return;

  return fetch(api.url + '/schema')
    .then(res => res.json())
    .then(json => {
      dispatch(getApiSuccess(json));
      dispatch(getCollectionsSuccess(Object.keys(json)));
    });
});

function recordEvent(collection, host, getState, dispatch, data) {
  const { api } = getState();
  const item = data.new_val;

  if (data.old_val) {
    dispatch(removeFromCollection({ item, collection }));
  }

  if (data.new_val) {
    dispatch(addToCollection({
      schema: api.schema[collection],
      status: api.changefeeds[host].state,
      item,
      collection
    }));
  }
}

function stateEvent(collection, host, getState, dispatch, data) {
  if (data.state === 'ready') {
    dispatch(updateApiChangefeedState({ status: data.state, host }));
    dispatch(updateDocumentChangefeedState({ status: data.state, collection }));
  }
}

const SocketListener = listener(({ api: { url, schema }, collections }) => {
  return Object.keys(collections).map(collection => {
    const host = `${url}/${schema[collection].pluralName}`;

    return {
      host: host,
      events: [{
        name: 'record',
        handler: recordEvent.bind(null, collection, host)
      }, {
        name: 'state',
        handler: stateEvent.bind(null, collection, host)
      }]
    };
  });
});

export default flow(SocketListener, Resolved, Connected)(Main);
