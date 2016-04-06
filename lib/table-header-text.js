const React = require('react');
const PropTypes = React.PropTypes;

module.exports = React.createClass({
  displayName: 'Table Header',

  propTypes: {
    fieldName: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    order: PropTypes.string.isRequired,
    onClickHandler: PropTypes.func.isRequired
  },

  render: function() {
    const fieldName = this.props.fieldName;
    const orderBy = this.props.orderBy;

    let orderText = ""
    if (fieldName === orderBy) orderText = " (" + this.props.order + ")"

    const text = this.props.fieldName + orderText;
    return React.DOM.span({onClick: this.props.onClickHandler}, text);
  }
});
