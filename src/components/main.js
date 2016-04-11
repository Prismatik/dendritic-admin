import React, {
  Component,
  createFactory,
  DOM,
  PropTypes
} from 'react';
import { extractHeaders } from '../lib/transformers/schema';
import creator from './creator';
import list from './list';
import listener from './listener';
import table from './table';

const Creator = createFactory(creator);
const List = createFactory(list);
const Table = createFactory(table);
const ListeningTable = createFactory(listener(Table));

export default class Main extends Component {
  render() {
    const { store, apiUrl } = this.props;
    const { schema, selectedModel } = store.state;
    const show = schema && selectedModel;

    return DOM.div({ className: "container row" },
      DOM.div({ className: "col s2" }, List({ store })),
      DOM.div({ className: "col" },
        show
          ? DOM.div(null, Creator({
                schema: schema[selectedModel],
                name: selectedModel,
                pluralName: schema[selectedModel].pluralName,
                apiUrl
              }),
              ListeningTable({
                schema: schema[selectedModel],
                name: schema[selectedModel].pluralName,
                headers: extractHeaders(schema[selectedModel].properties),
                host: apiUrl + '/' + schema[selectedModel].pluralName
              })
            )
          : null
      )
    )
  }
};

Main.propTypes = {
  store: PropTypes.object.isRequired,
  apiUrl: PropTypes.string.isRequired
};
