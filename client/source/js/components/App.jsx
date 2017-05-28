import React from 'react';
import PropTypes from 'prop-types';

import Inventory from './Inventory';
import Showroom from './Showroom';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.unsubscribe = this.context.store.subscribe(() => this.forceUpdate());
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    return (
      <div className="row">
        <Inventory />
        <Showroom />
      </div>
    );
  }
}
App.contextTypes = {
  store: PropTypes.object
};
