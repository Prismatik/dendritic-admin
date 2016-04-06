const _ = require('lodash');
const React = require('react');
const IO = require('socket.io-client');

const PropTypes = React.PropTypes;

module.exports = function(Component, props) {
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
        this.setState({socketData: this.state.socketData.concat(data)});
      });
    },

    componentWillUnmount: function() {
      this.state.socket.disconnect();
    },

    render: function() {
      const newProps = _.extend({}, props, {socketData: this.state.socketData});
      return Component(newProps);
    }
  });
}
