import update from 'immutability-helper';
import teamHeroes from '../../utils/teamHeroes';

import { SET_LEVEL, SET_HERO, CLOSE_MODAL, OPEN_MODAL, RESTART, START, USER_INPUT } from '../actions';

const INITIAL_STATE = {
  entities: [[]],
  gameLevel: 1,
  heroPosition: [],
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
  messages: [],
  modalOpen: true,
  modalTitle: '',
  modalList: teamHeroes,
  currentEntity: {},
  width: window.innerWidth,
  gridFilled: false,
};

function appState(state = INITIAL_STATE, action) {

  switch (action.type) {

    case SET_LEVEL:
      return update(
        state,
        {
          gameLevel: { $set: action.payload },
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
          },
        }
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

    case START:
      return update(
        state,
        {
          entities: { $set: action.payload.entities },
          heroPosition: { $set: action.payload.heroPosition },
          gridFilled: { $set: true },
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

    case RESTART:
      return INITIAL_STATE;

        default:
      return state;
  }
}

export default appState;