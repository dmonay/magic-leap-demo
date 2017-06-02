import React from 'react';
import PropTypes from 'prop-types';

import Line from './Line';
import Arrow from './Arrow';
import ModelRenderer from './ModelRenderer';

const SelectedShip = data => {
  const store = data.data.store;

  if (store.active.selected !== null) {
    return (
      <div>
        <ModelRenderer />
        <div className="hint">
          <span>Hint</span>: explore your ship by dragging it around. You can zoom!
        </div>
      </div>
    );
  }
  return (
    <div className="showroom-msg">
      Select a ship from the inventory <Arrow />
    </div>
  );
};

const animateArrow = () => {
  const svg = document.getElementById('animated-arrow');
  const arrow = document.querySelector('.arrow');
  const arrowFixed = document.querySelector('.arrow-fixed');

  if (svg && arrow && arrowFixed) {
    svg.setAttribute('class', 'polygonPathHover');
    arrow.setAttribute('class', 'arrowHover');
    arrowFixed.setAttribute('class', 'arrowFixedHover');
  }
};

export default class Showroom extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.unsubscribe = this.context.store.subscribe(() => this.forceUpdate());
  }
  componentDidUpdate() {
    animateArrow();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const store = this.context.store.getState();

    return (
      <div className="showroom-parent col-8">
        <Line data="showroomPath" />
        <SelectedShip data={{ store }} />
      </div>
    );
  }
}
Showroom.contextTypes = {
  store: PropTypes.object
};
