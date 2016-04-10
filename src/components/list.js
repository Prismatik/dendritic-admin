const React = require('react');
const PropTypes = React.PropTypes;

module.exports = React.createClass({
  displayName: 'List',

  propTypes: {
    store: PropTypes.shape({
      state: PropTypes.shape({
        endpoints: PropTypes.array.isRequired,
        schema: PropTypes.object,
        selectedModel: PropTypes.string
      }).isRequired,
      dispatch: PropTypes.func.isRequired
    }).isRequired,
  },

  render: function() {
    const endpointItems = this.props.store.state.endpoints.map(e => {
      const opts = {
        onClick: () => {
          this.props.store.dispatch({
            type: 'SELECT_MODEL',
            payload: {
              selectedModel: e.name
            }
          });
        }
      };
      return React.DOM.li(opts, e.name);
    });

    return React.DOM.ul.apply(
      this,
      [null].concat(endpointItems)
    );
  }
});
