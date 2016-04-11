const React = require('react');
const _ = require('lodash');
const DOM = require('react-dom');
const config = require('../config');
const css = require('./css/style.css');

import main from './components/main';

const Main = React.createFactory(main);

if (!config.apiUrl) {
  if (localStorage.apiUrl) config.apiUrl = localStorage.apiUrl;
  else config.apiUrl = prompt('Please enter an API URL');
  localStorage.apiUrl = config.apiUrl;
}

const store = {
  dispatch: action => {
    store.state = _.merge(store.state, action.payload);
    const state = store.state;

    DOM.render(
      Main({ store, apiUrl: localStorage.apiUrl }),
      document.getElementById('app')
    );
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
