export const changeEntity = (entity, coords) => {
	return {
		type: 'CHANGE_ENTITY',
		payload: { entity, coords }
	};
}

export const changeHeroPosition = (payload) => {
	return {
		type: 'CHANGE_HERO_POSITION',
		payload
	};
}

export const createLevel = (level) => {
	return {
		type: 'CREATE_LEVEL',
	        payload: fillGrid(generateMap(), level)
	};
}

export const setLevel = (payload) => {
	return {
		type: 'SET_LEVEL',
		payload
	};
}

const initialState = {
  entities: [[]],
  gameLevel: 0,
  heroPosition: []
};

const createBoard = (state = initialState, { type, payload }) => {
  switch (type) {

    case 'CHANGE_ENTITY': {
      const [x, y] = payload.coords;
      const entities = [ ...state.entities, {
        [y]: {
          [x]: {$set: payload.entity }
        }
      }];
      return { ...state, entities };
    }

    case 'CHANGE_HERO_POSITION':
      return { ...state, heroPosition: payload };

    case 'CREATE_LEVEL':
      return {
        ...state,
        heroPosition: payload.heroPosition,
        entities: payload.entities
      };

    case 'SET_LEVEL':
      return { ...state, gameLevel: payload };
    default:
      return state;
  }
}

export default createBoard;

const createStoreWithMiddleware = applyMiddleware()(createStore);

import { createLevel, setLevel } from './actions';
import createBoard from './reducers';

const store = createStore(createBoard);

store.dispatch(createLevel(1));
store.dispatch(setLevel(1));


