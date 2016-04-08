import { extend, reject } from 'lodash';
import React, { Component, PropTypes } from 'react';
import IO from 'socket.io-client';
import { transform } from '../lib/transformers/schema';

module.exports = function(Component) {
  return React.createClass({
    displayName: 'Listener',

    propTypes: {
      host: PropTypes.string.isRequired,
      schema: PropTypes.object.isRequired,
      eventName: PropTypes.string
    },

    getDefaultProps: function() {
      return {
        eventName: 'record'
      };
    },

    getInitialState: function() {
      return {
        socket: null,
        data: []
      };
    },

    componentWillMount: function() {
      const socket = IO(this.props.host);

      this.setState({socket: socket});

      socket.on(this.props.eventName, res => {
        var data = this.state.data;

        if (res.old_val) {
          data = reject(data, item => {
            return item.new_val.id === res.new_val.id;
          });
        }

        const transformed = transform(this.props.schema, res.new_val);
        this.setState({data: data.concat(transformed)});
      });
    },

    componentWillUnmount: function() {
      this.state.socket.disconnect();
    },

    render: function() {
      const data = {data: this.state.data};
      return Component(extend({}, this.props, data));
    }
  });
}
