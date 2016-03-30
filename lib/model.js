const React = require('react');
const IO = require('socket.io-client');

module.exports = React.createClass({
  displayName: 'Model',

  getInitialState: function() {
    return {
      model: {}
    };
  },

  initSocket: function() {
    if (this.state.socket) {
      this.state.socket.disconnect();
    }

    const linkArr = this.props.link.split('/');
    const path = linkArr.slice(0, -1).join('/');

    const socket = IO(this.props.apiUrl+'/'+path, {query: {id: this.props.id}});

    this.setState({socket: socket});

    socket.on('record', (data) => {
      this.setState({model: data.new_val});
    });
  },

  componentWillMount: function() {
    this.initSocket();
  },

  componentDidUpdate: function(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.initSocket();
    }
  },

  componentWillUnmount: function() {
    this.state.socket.disconnect();
  },

  render: function() {
    return React.DOM.div(
      null,
      React.DOM.textarea({value: JSON.stringify(this.state.model), readOnly: true}) // TODO actually render this into something reasonable
    );
  }
});
