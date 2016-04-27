import { find, forEach, fromPairs } from 'lodash';
import React, { Component, PropTypes } from 'react';
import IO from 'socket.io-client';

export default function listener(opts) {
  return function ListeningComponent(ComposedComponent) {
    class SocketListener extends Component {
      constructor(props) {
        super(props);
        this.state = { sockets: [] };
      }

      componentWillMount() {
        const { getState, dispatch } = this.context.store;
        const sockets = opts(this.props);
        const connected = fromPairs(sockets.map(s => {
          return [s.host, IO(s.host)];
        }));

        forEach(connected, (socket, host) => {
          const found = find(sockets, { host });

          found.events.forEach(event => {
            socket.on(event.name, event.handler.bind(null, getState, dispatch));
          });
        });

        this.setState({ sockets: connected });
      }

      render() {
        return <ComposedComponent {...this.props} />;
      }

      componentWillUnmount() {
        forEach(this.state.sockets, socket => socket.disconnect());
      }
    };

    SocketListener.contextTypes = {
      store: PropTypes.object
    };

    return SocketListener;
  };
};
