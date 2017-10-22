import { combineReducers } from 'redux';
import appState from '../reducers/appState';
// import hero from '../reducers/hero';
// import entities from '../reducers/entities';

const rootReducer = combineReducers({
  appState,
  // hero,
  // entities,
});

export default rootReducer;
