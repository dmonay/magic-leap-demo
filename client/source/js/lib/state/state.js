import { createStore, combineReducers } from 'redux';
import { Reducers } from './reducers.js';

export function initializeState() {
  const reducers = createReducers();
  return createStore(reducers);
}

function createReducers() {
  const reducers = new Reducers();

  // root reducer
  return combineReducers(reducers);
}
