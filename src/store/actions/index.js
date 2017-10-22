export const SET_LEVEL = 'SET_LEVEL';
export const SET_HERO = 'SET_HERO';
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const RESTART = 'RESTART';
export const START = 'START';
export const USER_INPUT = 'USER_INPUT';

export function setLevel(level) {
  return ({
    type: SET_LEVEL,
    payload: level,
  });
}

export function setHero(hero) {
	console.log(`setHero: ${hero.name}`)
  return ({
    type: SET_HERO,
    payload: hero,
  });
}

export function closeModal() {
  return ({
    type: CLOSE_MODAL,
  });
}

export function openModal(title, list) {
  return ({
    type: OPEN_MODAL,
    payload: {
    	title,
    	list,
    },
  });
}

export function userInput(entities, heroPosition) {
	return ({
    type: USER_INPUT,
    payload: {
    	entities,
    	heroPosition,
    }
  });
}

export function restart() {
	return ({
    type: RESTART,
  });
}

export function start(entities, heroPosition) {
	return ({
    type: START,
    payload: {
    	entities,
    	heroPosition,
    },
  });
}