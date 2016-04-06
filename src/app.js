const React = require('react');
const _ = require('lodash');
const DOM = require('react-dom');
const Listener = require('./components/listener');
const config = require('../config');
const css = require('./css/style.css');

const List = React.createFactory(require('./components/list.js'));
const Table = React.createFactory(require('./components/table.js'));
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
    DOM.render(List({store: store}), document.getElementById('list'));

    if (state.selectedModel) {
      const schema = state.schema[state.selectedModel];
      // FIXME pluralName should come from the schema
      const pluralName = state.selectedModel + 's';
      const opts = {
        schema: schema,
        name: state.selectedModel,
        pluralName: pluralName,
        apiUrl: localStorage.apiUrl
      };
      DOM.render(Creator(opts), document.getElementById('creator'));

      const host = localStorage.apiUrl + '/' + pluralName;
      const ListeningTable = React.createFactory(Listener(Table));
      DOM.render(ListeningTable(_.extend(opts, {host: host})), document.getElementById('table'));
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
  const endpoints = Object.keys(json).map(k => {return {name: k};});
  store.dispatch({payload: {schema: json, endpoints: endpoints}});
});
