const React = require('react');
const DOM = require('react-dom');
const IO = require('socket.io-client');
const _ = require('lodash');

const PropTypes = React.PropTypes;
const Model = React.createFactory(require('./model'));
const TableHeaderText = React.createFactory(require('./table-header-text'));

module.exports = React.createClass({
  displayName: 'Table',

  propTypes: {
    apiUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    pluralName: PropTypes.string.isRequired,
    schema: PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      dataRows: [],
      orderBy: "",
      order: ""
    };
  },

  calcRelations: function(schema) {
    if (!schema.links) return {};
    return schema.links.reduce((r, link) => {
      if (schema.properties[link.rel]) {
        r[link.rel] = link.href;
      }
      return r;
    }, {});
  },

  calcCells: function(doc, cols) {
    return cols.map(col => {
      if (!doc) return {};
      if (col.children) return {
        children: this.calcCells(doc[col.name], col.children)
      };

      const rel = this.state.relationships[col.name];
      let link;
      if (rel) {
        link = rel.replace('{'+col.name+'}', doc[col.name]);
      }

      return {
        data: doc[col.name],
        link: link
      };
    });
  },

  clickHandlerFactory: function(id, link) {
    return e => {
      this.setState({
        instance: Model({
          apiUrl: this.props.apiUrl,
          link: link,
          id: id
        })
      });
    };
  },

  wrapCell: function(cell) {
    if (Array.isArray(cell.data)) {
      return React.DOM.td({key: 'FIXME'+Math.random()}, 'Array');
    }
    if (cell.children && Array.isArray(cell.children)) {
      return cell.children.map(this.wrapCell);
    }

    const contents = cell.link ?
      React.DOM.button({
        href: this.props.apiUrl + cell.link,
        onClick: this.clickHandlerFactory(cell.data, cell.link)
      }, cell.data)
      : cell.data;

    return React.DOM.td({key: (cell.data || '')+Math.random()}, contents);
  },

  initSocket: function() {
    this.setState({dataRows: []});

    if (this.state.socket) {
      this.state.socket.disconnect();
    }

    const socket = IO(this.props.apiUrl+'/'+this.props.pluralName);
    this.setState({socket: socket});

    socket.on('record', (data) => {
      let dataRows = this.state.dataRows;

      const cells = this.calcCells(data.new_val, this.state.columns)
        .map(this.wrapCell);

      if (data.old_val) {
        dataRows = _.reject(dataRows, {key: data.new_val.id});
      };

      dataRows.push(React.DOM.tr({key: data.new_val.id}, cells));
      this.setState({dataRows: dataRows});
    });
  },

  componentWillMount: function() {
    const columns = this.calcColumns(this.props.schema.properties);
    const headers = this.calcHeaders(columns);
    const relationships = this.calcRelations(this.props.schema);

    this.setState({
      headers: headers,
      columns: columns,
      relationships: relationships,
    }, function() {
      this.initSocket();
    });
  },

  componentDidUpdate: function(prevProps) {
    if (prevProps.name !== this.props.name) {
      this.initSocket();
    }
  },

  componentWillUnmount: function() {
    this.state.socket.disconnect();
  },

  calcColumns: function(schemaProps) {
    return Object.keys(schemaProps).map(prop => {
      const v = schemaProps[prop];

      const col = {
        name: prop,
        colSpan: 1
      };

      if (v.properties) {
        col.children = this.calcColumns(v.properties);
        const totalChildren = col.children.reduce((r, col) => {
          return r += col.colSpan;
        }, 0);
        if (col.children.length) {
          col.colSpan = col.children.length + (totalChildren - col.children.length);
        } else {
          col.colSpan = totalChildren;
        }
      }

      return col;
    });
  },

  calcHeaders: function(columns) {
    return React.DOM.thead({key: 'thead'}, this.calcHeaderRow(columns));
  },

  updateOrderBy: function(columnName) {
    const nextOrder = {
      "": "asc",
      "asc": "desc",
      "desc": ""
    };

    let order = "asc";
    if (this.state.orderBy === columnName) order = nextOrder[this.state.order];
    const orderBy = order ? columnName : "";
    this.setState({ orderBy: orderBy, order: order });
  },

  calcHeaderRow: function(columns) {
    let breeder = false;
    const children = columns.map(col => {
      if (!col) return;
      breeder = breeder || col.children;
      return col.children;
    });
    const ret = [
      React.DOM.tr({key: 'header'+Math.random()}, columns.map(col => {
        if (!col) return React.DOM.th({key: Math.random()});

        const tableHeaderText = TableHeaderText({
          fieldName: col.name,
          orderBy: this.state.orderBy,
          order: this.state.order,
          onClickHandler: this.updateOrderBy.bind(this, col.name)
        });

        return React.DOM.th({
          key: col.name+Math.random(),
          colSpan: col.colSpan
        }, tableHeaderText);
      })),
    ];
    if (breeder) ret.push(this.calcHeaderRow(_.flatten(children)));
    return ret;
  },

  render: function() {
    return React.DOM.div(
      null,
      React.DOM.h3({key: 'header'}, this.props.pluralName),
      this.state.instance ?
        React.DOM.dialog({open: true, key: 'instance', id: 'instance'}, this.state.instance)
        : null, // TODO allow a specifed element or DOM node to be passed in at instantiation
      React.DOM.table({key: 'table'}, [
        this.state.headers,
        React.DOM.tbody({key: 'tbody'}, this.state.dataRows)
      ])
    );
  }
});
