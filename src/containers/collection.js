import { isEqual, isString, isUndefined, omit, reduce, toArray } from 'lodash';
import React, { Component, createElement, DOM, PropTypes } from 'react';
import { connect } from 'react-redux';
import Action from '../components/action';
import Creator from '../components/creator';
import Table from '../components/table';
import { extractHeaders } from '../lib/transformers/schema';
import { isUUID } from '../lib/validation';

export class Collection extends Component {
  static sanitizeData(data) {
    return toArray(reduce(data, (result, value, key) => {
      if (value.changefeed.state === 'ready') result[key] = omit(value, 'changefeed');
      return result;
    }, {}));
  }

  static iterator(collection, val) {
    const action = (path, data) => {
      const opts = { className: 'red-text text-accent-4', path };
      return createElement(Action, opts, data);
    };

    if (!isUndefined(val)) {
      if (isUUID(val))
        return action(`/collections/${collection}/${val}`, val);

      if (isString(val) && val.match(/^\//))
        return action(`/collections${val}`, val);
    }

    return val;
  }

  shouldComponentUpdate({ data }) {
    if (!isEqual(data, this.props.data)) return true;
    return false;
  }

  render() {
    const { schema, apiUrl, data } = this.props;

    return DOM.div({ className: 'section' },
      createElement(Creator, {
        name: schema.name,
        pluralName: schema.pluralName,
        apiUrl,
        schema
      }),
      createElement(Table, {
        name: schema.name,
        headers: extractHeaders(schema.properties),
        iterator: Collection.iterator.bind(this, schema.name),
        data
      })
    );
  }
}

Collection.propTypes = {
  schema: PropTypes.object.isRequired,
  apiUrl: PropTypes.string.isRequired,
  data: PropTypes.array
};

Collection.defaultProps = {
  data: []
};

export function mapStateToProps(state, { params: { name } }) {
  return {
    schema: state.api.schema[name],
    apiUrl: state.api.url,
    data: Collection.sanitizeData(state.collections[name])
  };
}

export default connect(mapStateToProps)(Collection);
