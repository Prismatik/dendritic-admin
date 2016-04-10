const React = require('react');
const _ = require('lodash');
const DOM = require('react-dom');
const extractHeaders = require('./lib/transformers/schema').extractHeaders;
const config = require('../config');
const css = require('./css/style.css');

import listener from './components/listener';
import table from './components/table';

const List = React.createFactory(require('./components/list.js'));
const Table = React.createFactory(table);
const Creator = React.createFactory(require('./components/creator.js'));

if (!config.apiUrl) {
  if (localStorage.apiUrl) config.apiUrl = localStorage.apiUrl;
  else config.apiUrl = prompt('Please enter an API URL');
  localStorage.apiUrl = config.apiUrl;
}

const store = {
  dispatch: action => {
    store.state = _.merge(store.state, action.payload);
    const state = store.state;
    console.log('state is', state);
    DOM.render(List({ store: store }), document.getElementById('list'));

    if (state.selectedModel) {
      const schema = state.schema[state.selectedModel];
      const opts = {
        schema: schema,
        name: state.selectedModel,
        pluralName: schema.pluralName,
        apiUrl: localStorage.apiUrl
      };
      DOM.render(Creator(opts), document.getElementById('creator'));

      const ListeningTable = React.createFactory(listener(Table));
      const tableProps = getTableProps(schema, localStorage.apiUrl);
      DOM.render(ListeningTable(tableProps), document.getElementById('table'));
    }
  },
  state: {
    endpoints: []
  }
};

const render = state => {
};

store.dispatch({});

fetch(config.apiUrl+'/schema')
.then(res => res.json())
.then(json => {
  const endpoints = Object.keys(json).map(k => { return { name: k };});
  store.dispatch({ payload: { schema: json, endpoints: endpoints }});
});

function getTableProps(schema, apiUrl) {
  return {
    schema: schema,
    name: schema.pluralName,
    headers: extractHeaders(schema.properties),
    host: apiUrl + '/' + schema.pluralName
  };
}
