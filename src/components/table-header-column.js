const React = require('react');

module.exports = React.createClass({
  displayName: 'Table Header Column',

  render: function() {
    return React.DOM.th(
      null,
      this.props.children
    );
  }
});
