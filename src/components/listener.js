const _ = require('lodash');
const React = require('react');
const IO = require('socket.io-client');
const schemaTransform = require('../lib/transformers/schema').transform;
const PropTypes = React.PropTypes;

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
        let data = this.state.data;

        if (res.old_val) {
          data = _.reject(data, item => {
            return item.new_val.id === res.new_val.id;
          });
        }

        const transformed = schemaTransform(this.props.schema, res.new_val);
        this.setState({data: data.concat(transformed)});
      });
    },

    componentWillUnmount: function() {
      this.state.socket.disconnect();
    },

    render: function() {
      const data = {data: this.state.data};
      return Component(_.extend({}, this.props, data));
    }
  });
}
