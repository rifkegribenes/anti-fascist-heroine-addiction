import update from 'immutability-helper';
import teamHeroes from '../../utils/teamHeroes';

import { SET_LEVEL, SET_HERO, UPDATE_HERO, UPDATE_TRUMP, CLOSE_MODAL, OPEN_MODAL, RESTART, START, USER_INPUT, SET_CURRENT_ENTITY, UPDATE_ENTITIES, UPDATE_MESSAGES, UPDATE_DIMENSIONS, HANDLE_STAIRCASE, UPDATE_GRID, SHOW_MSG, HIDE_MSG, TOGGLE_SOUND, TOGGLE_TORCH } from '../actions';

const INITIAL_STATE = {
  entities: [[]],
  gameLevel: 1,
  heroPosition: [],
  trumpPosition: [],
  hero: {
    hp: 100,
    xp: 0,
    attack: 10,
    name: '',
    cardUrl: '',
    iconUrl: '',
    aliases: '',
    powers: '',
    team: [],
    level: 1,
  },
  messages: ['Welcome to the dungeon! Try eating some food and gathering your team members before attacking any monsters.'],
  modalOpen: true,
  modalTitle: '',
  modalList: teamHeroes,
  bigMsg: {
    show: false,
    title: '',
    imgUrl: '',
    imgAlt: '',
    body: '',
    action: '',
    actionText: '',
  },
  currentEntity: {},
  clipSize: 640,
  gridFilled: false,
  sound: true,
  torch: true,
};

function appState(state = INITIAL_STATE, action) {
  let clipSize = 640;

  switch (action.type) {

    case SET_LEVEL:
      return update(
        state,
        {
          gameLevel: { $set: action.payload },
        },
      );

    case TOGGLE_TORCH:
      return update(
        state,
        {
          torch: { $set: !action.payload },
        },
      );

    case TOGGLE_SOUND:
      return update(
        state,
        {
          sound: { $set: !action.payload },
        },
      );

    case SET_HERO:
      return update(
        state,
        {
          hero: {
            name: { $set: action.payload.name },
            cardUrl: { $set: action.payload.cardUrl },
            iconUrl: { $set: action.payload.iconUrl },
            aliases: { $set: action.payload.aliases },
            powers: { $set: action.payload.powers },
            hp: { $set: 100 },
            xp: { $set: 0 },
            attack: { $set: 10 },
            team: { $set: [] },
            level: { $set: 1 },
          },
        },
      );

    case UPDATE_HERO:
      return update(
        state,
        {
          hero: {
            hp: { $set: action.payload.hp },
            xp: { $set: action.payload.xp },
            attack: { $set: action.payload.attack },
            team: { $set: action.payload.team },
            level: { $set: action.payload.level },
          },
        },
      );

    case UPDATE_TRUMP:
      return update(
        state,
        {
          trumpPosition: { $set: action.payload.trumpPosition },
          entities: { $set: action.payload.entities },
        },
      );


    case CLOSE_MODAL:
      return update(
        state,
        {
          modalOpen: { $set: false },
          modalTitle: { $set: '' },
        },
      );

    case OPEN_MODAL:
      return update(
        state,
        {
          modalOpen: { $set: true },
          modalTitle: { $set: action.payload.title },
          modalList: { $set: action.payload.list },
        },
      );

    case SHOW_MSG:
      return update(
        state,
        {
          bigMsg: {
            show: { $set: true },
            title: { $set: action.payload.title },
            imgUrl: { $set: action.payload.imgUrl },
            imgAlt: { $set: action.payload.imgAlt },
            body: { $set: action.payload.body },
            action: { $set: action.payload.action },
            actionText: { $set: action.payload.actionText },
          },
        },
      );

    case HIDE_MSG:
      return update(
        state,
        {
          bigMsg: {
            show: { $set: false },
            title: { $set: '' },
            imgUrl: { $set: '' },
            imgAlt: { $set: '' },
            body: { $set: '' },
            action: { $set: '' },
            actionText: { $set: '' },
          },
        },
      );

    case START:
      return update(
        state,
        {
          entities: { $set: action.payload.entities },
          heroPosition: { $set: action.payload.heroPosition },
          gridFilled: { $set: true },
          trumpPosition: { $set: action.payload.trumpPosition },
        },
      );

    case USER_INPUT:
      return update(
        state,
        {
          entities: { $set: action.payload.entities },
          heroPosition: { $set: action.payload.heroPosition },
        },
      );

    case UPDATE_GRID:
      return update(
        state,
        {
          entities: { $set: action.payload.entities },
          heroPosition: { $set: action.payload.heroPosition },
        },
      );

    case UPDATE_ENTITIES:
      return update(
        state,
        {
          entities: { $set: action.payload.entities },
        },
      );

    case SET_CURRENT_ENTITY:
      return update(
        state,
        {
          currentEntity: { $set: action.payload },
        },
      );

    case UPDATE_MESSAGES:
      return update(
        state,
        {
          messages: { $set: action.payload },
        },
      );

    case UPDATE_DIMENSIONS:
      if (action.payload.width < 1040 || action.payload.height < 768) {
        if (action.payload.height > action.payload.width) {
          clipSize = (action.payload.width * 0.6) - 20;
        } else {
          clipSize = Math.min((action.payload.width * 0.6),
            (action.payload.height - 105)) - 20;
        }
      }
      return update(
        state,
        {
          clipSize: { $set: clipSize },
        },
      );

    case HANDLE_STAIRCASE:
      return update(
        state,
        {
          currentEntity: { $set: action.payload.currentEntity },
          heroPosition: { $set: action.payload.heroPosition },
          trumpPosition: { $set: action.payload.trumpPosition },
          entities: { $set: action.payload.entities },
          gameLevel: { $set: action.payload.gameLevel },
        },
        );

    case RESTART:
      return INITIAL_STATE;

    default:
      return state;
  }
}

export default appState;
