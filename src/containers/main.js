import { flow } from 'lodash';
import React, { Component, createFactory, DOM, PropTypes } from 'react';
import { connect } from 'react-redux';
import { resolve } from 'react-resolver';
import header from '../components/header';
import nav from '../components/nav';
import listener from '../components/socket_listener';
import { getApiSuccess } from '../redux/actions/api';
import {
  getCollectionsSuccess,
  addToCollection,
  removeFromCollection,
  updateCollectionSocketStatus
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

const SocketListener = listener(({ api, collections, dispatch }) => {
  return Object.keys(collections).map(collection => {
    const { pluralName } = api.schema[collection];
    const host = `${api.url}/${pluralName}`;

    return {
      host: host,
      events: [{
        name: 'record',
        handler: function(data) {
          const item = data.new_val;

          // If API returns an old version, remove it before the new one is
          // added.
          if (data.old_val) {
            dispatch(removeFromCollection({ item, collection }));
          }

          dispatch(addToCollection({
            schema: api.schema[collection],
            item,
            collection
          }));
        }
      }, {
        name: 'state',
        handler: function(data) {
          if (data.state === 'ready') {
            dispatch(updateCollectionSocketStatus({
              status: data.state,
              collection
            }));
          }
        }
      }]
    };
  });
});

export default flow(SocketListener, Resolved, Connected)(Main);
