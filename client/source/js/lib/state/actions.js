const addInventory = (dispatch, data) => {
  dispatch({ type: 'ADD_INVENTORY', data: data });
};

export default {
  addInventory
};
