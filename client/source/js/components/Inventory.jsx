import React from 'react';
import PropTypes from 'prop-types';

require('../../assets/img/racepod.svg');
import Line from './Line';
import actions from 'lib/state/actions.js';

const InventoryView = data => {
  const d = data.data;
  const store = d.store;

  if (store.active.selected !== null) {
    const ship = store.inventory[store.active.selected];
    const specs = ship.techspecs;
    const customClass = determineClass(ship.class);

    return (
      <div>
        <div className="ship-details">
          <div className="spec-title">name</div>
          <div>{ship.name}</div>
          <div className="spec-title">class</div>
          <div className={customClass}>{ship.class}</div>
          <div className="spec-title">manufacturer</div>
          <div>{ship.manufacturer}</div>
          <div className="spec-title">specs</div>
          <div className="tech-specs">
            {Object.keys(specs).map(function(spec, idx) {
              return (
                <div key={idx}>
                  <div className="spec-name">{spec} :</div>
                  <div className="spec-content">{specs[spec]}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="back-btn" onClick={() => d.deselectShipHandler()}>
          <i className="fa fa-chevron-left" aria-hidden="true" />
          {' '} Back to inventory
        </div>
      </div>
    );
  }
  return (
    <div>
      {store.inventory.map(function(ship, i) {
        return <InventoryItem data={ship} i={i} key={i} handler={d.selectShipHandler} />;
      })}
    </div>
  );
};

const determineClass = shipClass => {
  const map = {
    Starfighter: 'fighter',
    'Light freighter': 'freighter',
    'Transport shuttle': 'shuttle'
  };
  return 'inventory-class ' + map[shipClass];
};

const InventoryItem = data => {
  const racepodSrc = '../../../../build/assets/racepod.svg';
  const racepodStyle = {
    backgroundImage: 'url(' + racepodSrc + ')'
  };
  const customClass = determineClass(data.data.class);

  const handler = data.handler;

  return (
    <div className="inventory-item" key={data.i} onClick={() => handler(data.i)}>
      <p className="inventory-shot" style={racepodStyle} />
      <p className="inventory-name">{data.data.name}</p>
      <p className={customClass}><span>CLASS</span>: {data.data.class}</p>
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
    this.dispatch = this.context.store.dispatch;

    // Get the inventory JSON
    fetch('http://demo7475333.mockable.io/spaceships')
      .then(response => response.json())
      .then(inventory => {
        if (Object.keys(inventory.products).length === 0) {
          this.setState({ error: 'Empty JSON response' });
          return;
        }
        this.setState({ loaded: true });
        actions.addInventory(this.dispatch, inventory.products);
      })
      .catch(error => {
        this.setState({ error });
        this.setState({ loaded: true });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  selectShip(data) {
    actions.selectShip(this.dispatch, data);
  }

  deselectShip(data) {
    actions.deselectShip(this.dispatch, data);
  }

  render() {
    const store = this.context.store.getState();
    const selectShipHandler = this.selectShip.bind(this);
    const deselectShipHandler = this.deselectShip.bind(this);

    if (!this.state.loaded) {
      return <h1 className="loading">Loading Inventory...</h1>;
    }

    if (this.state.error) {
      document.body.style.backgroundColor = '#c72b2b';
      return (
        <div className="inventory-parent col-4">
          <h1>Error!</h1>
          <p>{this.state.error.toString()}</p>
        </div>
      );
    }

    return (
      <div className="inventory-parent col-4">
        <Line data="inventoryPath" />
        <div className="inventory">
          <InventoryView data={{ store, selectShipHandler, deselectShipHandler }} />
        </div>
      </div>
    );
  }
}
Inventory.contextTypes = {
  store: PropTypes.object
};
