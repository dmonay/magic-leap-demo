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

export function Reducers() {
  this.inventory = inventory();
}
