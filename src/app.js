import React, { createElement } from 'react';
import DOM from 'react-dom';
import { Provider } from 'react-redux';
import main from './containers/main';
import css from './css/style.css';
import configureStore, { reducer } from './redux/store';
import config from '../config';

if (!config.apiUrl) {
  if (localStorage.apiUrl) config.apiUrl = localStorage.apiUrl;
  else config.apiUrl = prompt('Please enter an API URL');
  localStorage.apiUrl = config.apiUrl;
}

const Main = React.createFactory(main);
const store = configureStore(reducer, { api: { url: localStorage.apiUrl } });

DOM.render((
  createElement(Provider, { store }, Main())
), document.getElementById('app'));
