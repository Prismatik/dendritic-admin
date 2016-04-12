import { find, flow, map, toArray } from 'lodash';
import React, { Component, createFactory, DOM, PropTypes } from 'react';
import { connect } from 'react-redux';
import { resolve } from 'react-resolver';
import { bindActionCreators } from 'redux';
import creator from '../components/creator';
import nav from '../components/nav';
import listener from '../components/socket_listener';
import table from '../components/table';
import { getApiSuccess } from '../redux/actions/api';
import {
  getCollectionsSuccess,
  updateCollection
} from '../redux/actions/collections';
import * as navActions from '../redux/actions/nav';
import { extractHeaders } from '../lib/transformers/schema';

const Creator = createFactory(creator);
const Nav = createFactory(nav);
const Table = createFactory(table);

export class Main extends Component {
  render() {
    const {
      api: { url, schema },
      nav: { active },
      collections,
      navActions
    } = this.props;

    const activeSchema = schema[active];

    return DOM.div({ className: 'container row' },
      DOM.div({ className: 'col s2' },
        Nav({
          items: Object.keys(collections),
          itemOnClick: (e, item) => {
            e.preventDefault();

            const found = find(schema, i => i.pluralName == item);
            navActions.setNavActive(found.name);
          }
        })
      ),
      DOM.div({ className: 'col s8' },
        activeSchema
          ? DOM.div(null,
              Creator({
                schema: activeSchema,
                name: active,
                apiUrl: url,
                pluralName: activeSchema.pluralName
              }),
              Table({
                name: activeSchema.pluralName,
                headers: extractHeaders(activeSchema.properties),
                data: toArray(collections[activeSchema.pluralName])
              })
            )
          : null
      )
    );
  }
};

Main.propTypes = {
  api: PropTypes.object.isRequired,
  collections: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired
};

const Connected = connect(state => ({
  api: state.api,
  collections: state.collections,
  nav: state.nav
}), dispatch => ({
  navActions: bindActionCreators(navActions, dispatch),
  dispatch
}));

const Resolved = resolve('init', ({ api, dispatch }) => {
  if (api.schema) return;

  return fetch(api.url + '/schema')
    .then(res => res.json())
    .then(json => {
      dispatch(getApiSuccess(json));
      dispatch(getCollectionsSuccess(map(json, 'pluralName')));
    });
});

const SocketListener = listener(({ api, collections, dispatch }) => {
  return Object.keys(collections).map(collection => ({
    host: api.url + '/' + collection,
    event: 'record',
    handler: data => {
      dispatch(updateCollection({ collection, item: data.new_val }));
    }
  }));
});

export default flow(SocketListener, Resolved, Connected)(Main);
