import axios from 'axios';
import config from 'root/config';

const api = () => {
  return axios.create({ baseURL: config.apiUrl });
};

'get post put delete'.split(/\s+/).forEach(method => {
  exports[method] = (path, params) => {
    return api()[method](path, params)
      .then(response => response.data);
  };
});
