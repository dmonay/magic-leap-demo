const inventory = () => {
  return (state = [], action) => {
    switch (action.type) {
      case 'ADD_INVENTORY':
        return [...state, ...action.data];
      default:
        return state;
    }
  };
};

const active = () => {
  return (state = { selected: null }, action) => {
    switch (action.type) {
      case 'SELECT_SHIP':
        return {
          ...state,
          selected: action.data
        };
      case 'DESELECT_SHIP':
        return {
          ...state,
          selected: null
        };
      default:
        return state;
    }
  };
};

export function Reducers() {
  this.inventory = inventory();
  this.active = active();
}
