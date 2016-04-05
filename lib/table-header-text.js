const React = require('react');
const PropTypes = React.PropTypes;

module.exports = React.createClass({
  displayName: 'Table Header',

  propTypes: {
    fieldName: PropTypes.string.isRequired,
    updateQuery: PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {mode: "none"};
  },

  getMode: function(mode) {
    const DEFINITIONS = {
      none: {icon: "", queryOpt: {orderBy: null, order: null}, nextMode: "asc"},
      asc: {icon: "^", queryOpt: {orderBy: this.props.fieldName, order: "asc"}, nextMode: "desc"},
      desc: {icon: "*", queryOpt: {orderBy: this.props.fieldName, order: "desc"}, nextMode: "none"} //TODO - replace with down arrow
    };

    return DEFINITIONS[mode];
  },

  setNextMode: function() {
    const mode = this.getMode(this.state.mode);
    return this.setState({mode: mode.nextMode});
  },

  clickHander: function() {
    const mode = this.getMode(this.state.mode);
    const nextMode = this.getMode(mode.nextMode);
    this.props.updateQuery(this.props.fieldName, nextMode.queryOpt);

    this.setNextMode();
  },

  render: function() {
    const mode = this.getMode(this.state.mode);
    const text = this.props.fieldName + " " + mode.icon;

    return React.DOM.span({onClick: this.clickHander}, text);
  }
});
