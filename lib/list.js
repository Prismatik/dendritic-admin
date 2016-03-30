const React = require('react');

module.exports = React.createClass({
  displayName: 'List',

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
