import React from 'react';
import PropTypes from 'prop-types';

import Line from './Line';

export default class PlayerBox extends React.Component {
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
    const store = this.context.store.getState();

    return (
      <div className="showroom-parent col-8">
        <Line data="showroomPath" />
        <div className="showroom">
          I am Showroom!
        </div>
      </div>
    );
  }
}
PlayerBox.contextTypes = {
  store: PropTypes.object
};
