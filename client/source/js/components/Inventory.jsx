import React from 'react';
import PropTypes from 'prop-types';

require('../../assets/img/racepod.svg');
import Line from './Line';
import actions from 'lib/state/actions.js';

const determineClass = shipClass => {
  const map = {
    Starfighter: 'fighter',
    'Light freighter': 'freighter',
    'Transport shuttle': 'shuttle'
  };
  return 'inventory-class ' + map[shipClass];
};

const InventoryItem = (ship, i) => {
  const racepodSrc = '../../../../build/assets/racepod.svg';
  const playerHeadshot = {
    backgroundImage: 'url(' + racepodSrc + ')'
  };
  const customClass = determineClass(ship.data.class);
  return (
    <div className="inventory-item" key={i}>
      <p className="inventory-shot" style={playerHeadshot} />
      <p className="inventory-name">{ship.data.name}</p>
      <p className={customClass}><span>CLASS</span>: {ship.data.class}</p>
    </div>
  );
};

export default class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inventory: [],
      error: false,
      loaded: false
    };
  }
  componentDidMount() {
    this.unsubscribe = this.context.store.subscribe(() => this.forceUpdate());

    fetch('http://demo7475333.mockable.io/spaceships')
      .then(response => response.json())
      .then(inventory => {
        if (Object.keys(inventory.products).length === 0) {
          this.setState({ error: 'Empty JSON response' });
          return;
        }
        this.setState({ loaded: true });
        actions.addInventory(this.context.store.dispatch, inventory.products);
      })
      .catch(error => {
        this.setState({ error });
        this.setState({ loaded: true });
      });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const store = this.context.store.getState();

    if (!this.state.loaded) {
      return <h1>Loading Inventory...</h1>;
    }

    if (this.state.error) {
      document.body.style.backgroundColor = '#c72b2b';
      return (
        <div>
          <h1>Error!</h1>
          <p>{this.state.error.toString()}</p>
        </div>
      );
    }

    return (
      <div className="inventory-parent col-4">
        <Line data="inventoryPath" />
        <div className="inventory">
          {store.inventory.map(function(ship, i) {
            return <InventoryItem data={ship} key={i} />;
          })}
        </div>
      </div>
    );
  }
}
Inventory.contextTypes = {
  store: PropTypes.object
};
