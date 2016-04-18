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
  removeFromCollection
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
  return Object.keys(collections).map(collection => ({
    host: api.url + '/' + api.schema[collection].pluralName,
    event: 'record',
    handler: data => {

      // If API returns an old version, remove it before the new one is added.
      if (data.old_val) {
        dispatch(removeFromCollection({
          item: data.new_val,
          collection
        }));
      }

      dispatch(addToCollection({
        schema: api.schema[collection],
        item: data.new_val,
        collection
      }));
    }
  }));
});

export default flow(SocketListener, Resolved, Connected)(Main);
