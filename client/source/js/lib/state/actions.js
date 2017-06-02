const addInventory = (dispatch, data) => {
  dispatch({ type: 'ADD_INVENTORY', data: data });
};

const selectShip = (dispatch, data) => {
  dispatch({ type: 'SELECT_SHIP', data: data });
};

const deselectShip = (dispatch, data) => {
  dispatch({ type: 'DESELECT_SHIP', data: data });
};

export default {
  addInventory,
  selectShip,
  deselectShip
};
