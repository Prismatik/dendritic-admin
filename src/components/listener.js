import { reject } from 'lodash';
import React, { Component, PropTypes } from 'react';
import IO from 'socket.io-client';
import { transform } from '../lib/transformers/schema';

export default ComposedComponent => {
  class Listener extends Component {
    constructor(props) {
      super(props);

      this.state = {
        socket: null,
        data: []
      };
    }

    componentWillMount() {
      const { host, schema, eventName } = this.props;
      const socket = IO(host);

      this.setState({ socket });

      socket.on(eventName, res => {
        let data = this.state.data

        if (res.old_val) {
          data = reject(data, item => item.new_val.id === res.new_val.id);
        }

        this.setState({ data: data.concat(transform(schema, res.new_val)) });
      });
    }

    componentWillUnmount() {
      this.state.socket.disconnect();
    }

    render() {
      return ComposedComponent({ ...this.props, data: this.state.data });
    }
  };

  Listener.propTypes = {
    host: PropTypes.string.isRequired,
    schema: PropTypes.object.isRequired,
    eventName: PropTypes.string
  };

  Listener.defaultProps = {
    eventName: 'record'
  }

  return Listener;
}
