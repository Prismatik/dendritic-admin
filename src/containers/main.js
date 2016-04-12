import { flowRight } from 'lodash';
import React, { Component, createFactory, DOM, PropTypes } from 'react';
import { connect } from 'react-redux';
import { resolve } from 'react-resolver';
import { bindActionCreators } from 'redux';
import { extractHeaders } from '../lib/transformers/schema';
import { getApiSuccess } from '../redux/actions/api';
import { getCollectionsSuccess } from '../redux/actions/collections';
import * as navActions from '../redux/actions/nav';
import creator from '../components/creator';
import listener from '../components/listener';
import nav from '../components/nav';
import table from '../components/table';

const Creator = createFactory(creator);
const Nav = createFactory(nav);
const Table = createFactory(table);
const ListeningTable = createFactory(listener(Table));

export class Main extends Component {
  render() {
    const {
      api: { url, schema },
      collections,
      nav: { active },
      navActions
    } = this.props;

    return DOM.div({ className: 'container row' },
      DOM.div({ className: 'col s2' },
        Nav({
          items: Object.keys(collections),
          itemOnClick: (e, name) => {
            e.preventDefault();
            navActions.setNavActive(name);
          }
        })
      ),
      DOM.div({ className: 'col' },
        active
          ? DOM.div(null, Creator({
                schema: schema[active],
                name: active,
                pluralName: schema[active].pluralName,
                apiUrl: url
              }),
              ListeningTable({
                schema: schema[active],
                name: schema[active].pluralName,
                headers: extractHeaders(schema[active].properties),
                host: url + '/' + schema[active].pluralName
              })
            )
          : null
      )
    );
  }
};

Main.propTypes = {
  api: PropTypes.object.isRequired,
  collections: PropTypes.object.isRequired
};

const Resolved = resolve('init', props => {
  if (props.api.schema) return;

  fetch(props.api.url + '/schema')
    .then(res => res.json())
    .then(json => {
      props.dispatch(getApiSuccess(json));
      props.dispatch(getCollectionsSuccess(Object.keys(json)));
    });
});

const Connected = connect(state => ({
  api: state.api,
  collections: state.collections,
  nav: state.nav
}), dispatch => ({
  navActions: bindActionCreators(navActions, dispatch),
  dispatch
}));

export default flowRight(Connected, Resolved)(Main);
