const React = require('react');
const PropTypes = React.PropTypes;

module.exports = React.createClass({
  displayName: 'Table Row',

  propTypes: {
    columns: PropTypes.arrayOf(PropTypes.element).isRequired
  },

  render: function() {
    return React.DOM.tr(
      null,
      this.props.columns
    );
  }
});
