const _ = require('lodash');
const React = require('react');
const IO = require('socket.io-client');

const PropTypes = React.PropTypes;

module.exports = function(Component) {
  return React.createClass({
    displayName: 'Listener',

    propTypes: {
      host: PropTypes.string.isRequired,
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
        socketData: []
      };
    },

    componentWillMount: function() {
      const socket = IO(this.props.host);

      this.setState({socket: socket});

      socket.on(this.props.eventName, data => {
        var socketData = this.state.socketData;

        if (data.old_val) {
          socketData = _.reject(socketData, item => {
            return item.new_val.id === data.new_val.id
          });
        }

        this.setState({socketData: socketData.concat(data)});
      });
    },

    componentWillUnmount: function() {
      this.state.socket.disconnect();
    },

    render: function() {
      const data = {socketData: this.state.socketData};
      return Component(_.extend({}, this.props, data));
    }
  });
}
