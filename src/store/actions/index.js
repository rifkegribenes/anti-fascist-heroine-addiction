export const SET_LEVEL = 'SET_LEVEL';
export const SET_HERO = 'SET_HERO';
export const UPDATE_HERO = 'UPDATE_HERO';
export const UPDATE_TRUMP = 'UPDATE_TRUMP';
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const RESTART = 'RESTART';
export const START = 'START';
export const USER_INPUT = 'USER_INPUT';
export const SET_CURRENT_ENTITY = 'SET_CURRENT_ENTITY';
export const UPDATE_MESSAGES = 'UPDATE_MESSAGES';
export const UPDATE_GRID = 'UPDATE_GRID';
export const UPDATE_DIMENSIONS = 'UPDATE_DIMENSIONS';
export const UPDATE_ENTITIES = 'UPDATE_ENTITIES';
export const HANDLE_STAIRCASE = 'HANDLE_STAIRCASE';
export const SHOW_MSG = 'SHOW_MSG';
export const HIDE_MSG = 'HIDE_MSG';

export function setLevel(level) {
  return ({
    type: SET_LEVEL,
    payload: level,
  });
}

export function setHero(hero) {
  return ({
    type: SET_HERO,
    payload: hero,
  });
}

export function updateHero(hero) {
  return ({
    type: UPDATE_HERO,
    payload: hero,
  });
}

export function updateTrump(trumpPosition, entities) {
  return ({
    type: UPDATE_TRUMP,
    payload: {
      trumpPosition,
      entities,
    },
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

export function hideMsg() {
  return ({
    type: HIDE_MSG,
  });
}

export function showMsg(msg) {
  return ({
    type: SHOW_MSG,
    payload: {
      title: msg.title,
      imgUrl: msg.imgUrl,
      imgAlt: msg.imgAlt,
      body: msg.body,
      action: msg.action,
      actionText: msg.actionText,
    },
  });
}

export function userInput(entities, heroPosition) {
  return ({
    type: USER_INPUT,
    payload: {
      entities,
      heroPosition,
    },
  });
}

export function updateGrid(entities, heroPosition) {
  return ({
    type: UPDATE_GRID,
    payload: {
      entities,
      heroPosition,
    },
  });
}

export function updateDimensions(width, height) {
  return ({
    type: UPDATE_DIMENSIONS,
    payload: {
      width,
      height,
    },
  });
}

export function restart() {
  return ({
    type: RESTART,
  });
}

export function start(entities, heroPosition, trumpPosition) {
  return ({
    type: START,
    payload: {
      entities,
      heroPosition,
      trumpPosition,
    },
  });
}

export function updateEntities(entities) {
  return ({
    type: UPDATE_ENTITIES,
    payload: {
      entities,
    },
  });
}

export function handleStaircase(currentEntity, heroPosition, trumpPosition, entities, gameLevel) {
  return ({
    type: HANDLE_STAIRCASE,
    payload: {
      currentEntity,
      heroPosition,
      trumpPosition,
      entities,
      gameLevel,
    },
  });
}

export function setCurrentEntity(entity) {
  return ({
    type: SET_CURRENT_ENTITY,
    payload: entity,
  });
}

export function updateMessages(messages) {
  return ({
    type: UPDATE_MESSAGES,
    payload: messages,
  });
}
