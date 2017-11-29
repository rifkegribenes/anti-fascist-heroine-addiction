import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import shortid from 'shortid';
import { withRouter } from 'react-router';
// import update from 'immutability-helper';

import * as Actions from '../store/actions';
import InfoLeft from './InfoLeft';
import InfoRight from './InfoRight';
import * as utils from '../utils/index';
import generateMap from '../utils/mapgen';
import fillGrid from '../utils/fillGrid';

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license

const animate = () => {
  let lastTime = 0;
  const vendors = ['ms', 'moz', 'webkit', 'o'];
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`];
    window.cancelAnimationFrame = window[`${vendors[x]}CancelAnimationFrame`]
    || window[`${vendors[x]}CancelRequestAnimationFrame`];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (callback) => {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(() => { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (id) => {
      clearTimeout(id);
    };
  }
};
animate();

// const lastRender = 0;

const updateXP = (xp) => {
  const width = xp / 3;
  document.styleSheets[0].addRule('.hero__xp-slider::after', `width: ${width}% !important`);
};

class Board extends Component {

  constructor(props) {
    super(props);

    this.state = {
      myReq: null,
      modal: false,
    };

    this.handleKeydown = this.handleKeydown.bind(this);
    this.userInput = this.userInput.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.updateDimensions();
    this.startGame();
    window.addEventListener('keydown', this.handleKeydown);
    window.addEventListener('resize', this.updateDimensions);
    updateXP(0);
    document.getElementById('board').focus();
  }

  componentDidUpdate(prevProps) {
    // listen for completion of map generation
    // before rendering viewport and starting gameloop
    if (!prevProps.appState.gridFilled) {
      if (this.props.appState.gridFilled) {
        // console.log('grid is now filled, calling play()');
        this.play();
      }
    }
    // listen for window size change and render full viewport
    // instead of only changed cells
    if (prevProps.appState.clipSize !== this.props.appState.clipSize) {
      this.draw(true);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('resize', this.updateDimensions);
    window.clearInterval(window.interval);
    cancelAnimationFrame(this.state.myReq);
  }

  updateDimensions() {
    this.props.actions.updateDimensions(window.innerWidth, window.innerHeight);
    this.draw();
  }

  openModal() {
    this.setState({
      modal: true,
    });
  }

  closeModal() {
    this.setState({
      modal: false,
    });
  }

  handleKeydown(e) {
    switch (e.keyCode) {
      case 38:
      case 87:
        this.props.playSound('movement');
        e.preventDefault();
        this.userInput([0, -1]);
        break;
      case 39:
      case 68:
        this.props.playSound('movement');
        e.preventDefault();
        this.userInput([1, 0]);
        break;
      case 40:
      case 83:
        this.props.playSound('movement');
        e.preventDefault();
        this.userInput([0, 1]);
        break;
      case 37:
      case 65:
        this.props.playSound('movement');
        e.preventDefault();
        this.userInput([-1, 0]);
        break;
      default:
    }
  }

  userInput(change) {
    const oldRoom = this.props.appState.hero.room;
    const [x, y] = this.props.appState.heroPosition;
    const [changeX, changeY] = change;
    const newPosition = [changeX + x, changeY + y];
    const newHero = this.props.appState.hero;
    const destination = this.props.appState.entities[y + changeY][x + changeX];
    // for any valid destination type
    // (for wall do nothing)
    if (destination.type !== 'wall') {
      let grid1;
      let grid2;

      // FLOOR => FLOOR
      // replace vacated cell with floor
      // console.log(`floor => floor, currEntity type: ${this.props.appState.currentEntity.type}`);
      if (destination.type === 'floor' && destination.room !== 'door') {
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: oldRoom }, [x, y]);
        grid2 = utils.changeEntity(grid1, newHero, newPosition);
        this.props.actions.updateGrid(grid2, newPosition);
        this.draw();
      }

      // ANYTHING => UNOCCUPIED DOORWAY
      // change hero room to door, replace vacated cell with floor
      if (destination.room === 'door' && (destination.type === 'door' || destination.type === 'floor')) {
        newHero.room = 'door';
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: oldRoom }, [x, y]);
        grid2 = utils.changeEntity(grid1, newHero, newPosition);
        this.props.actions.updateGrid(grid2, newPosition);
        this.draw();
        this.props.actions.updateHero(newHero);
        return;
      }

      // ANYTHING => MONSTER IN DOORWAY (no other entitity can be in door)
      // replace vacated cell with floor, change hero room, handle entity
      if (destination.room === 'door' &&
        destination.type !== 'door' &&
        destination.type !== 'floor') {
        // console.log('Hero => MONSTER IN DOORWAY');
        newHero.room = 'door';
        this.props.actions.updateHero(newHero);
        document.getElementById('entity').classList.remove('spin');
        this.handleCombat(destination, newPosition, this.props.appState.heroPosition, 'hero');
        return;
      }

      // DOOR => FLOOR
      // replace vacated cell with door
      if (oldRoom === 'door' && destination.type === 'floor') {
        newHero.room = destination.room;
        this.props.actions.updateHero(newHero);
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'door', room: 'door' }, [x, y]);
        grid2 = utils.changeEntity(grid1, newHero, newPosition);
        this.props.actions.updateGrid(grid2, newPosition);
        this.draw();
      }

      // DOOR => MONSTER NOT IN DOORWAY
      // replace vacated cell with door, handle combat
      if (oldRoom === 'door' && (destination.type === 'monster' || destination.type === 'finalMonster')) {
        // console.log(`Hero => MONSTER at ${newPosition}`);
        document.getElementById('entity').classList.remove('spin');
        this.handleCombat(destination, newPosition, this.props.appState.heroPosition, 'hero', true);
        return;
      }

      // DOOR => OTHER ENTITY NOT IN DOORWAY
      // replace vacated cell with door, handle entity
      if (oldRoom === 'door' && destination.type !== 'floor') {
        newHero.room = this.props.appState.entities[y][x].room;
        this.props.actions.updateHero(newHero);
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'door', room: 'door' }, [x, y]);
        grid2 = utils.changeEntity(grid1, newHero, newPosition);
        this.props.actions.updateGrid(grid2, newPosition);
        this.props.actions.setCurrentEntity(destination);
        document.getElementById('entity').classList.remove('spin');
        this.draw();
        switch (destination.type) {
          // if monster, handle combat
          case 'finalMonster':
          case 'monster':
            // console.log('Hero DOOR => MONSTER');
            this.props.actions.updateCombat(destination.name, 'hero');
            this.handleCombat(destination, newPosition, this.props.appState.heroPosition, 'hero');
            break;
          case 'food':
            // console.log('Hero DOOR => FOOD');
            this.props.playSound('food');
            this.healthBoost(destination);
            break;
          case 'teamHero':
            // console.log('Hero DOOR => THERO');
            this.props.playSound('addHero');
            this.addTeamHero(destination);
            break;
          case 'staircase':
            // console.log('Hero DOOR => STAIRCASE');
            this.props.playSound('staircase');
            this.handleStaircase(destination);
            break;
          case 'candle':
            // console.log('Hero DOOR => CANDLE');
            this.props.playSound('magicItem');
            this.handleCandle();
            break;
          case 'key':
            // console.log('Hero DOOR => KEY');
            this.props.playSound('magicItem');
            this.handleKey();
            break;
          default:
        }
        return;
      }

      // ANYTHING BUT DOOR => MONSTER NOT IN DOORWAY
      // replace vacated cell with floor, handle combat
      if ((destination.type === 'monster' || destination.type === 'finalMonster') && destination.room !== 'door') {
        // console.log('Hero => MONSTER');
        document.getElementById('entity').classList.remove('spin');
        this.handleCombat(destination, newPosition, this.props.appState.heroPosition, 'hero');
        return;
      }

      // ANYTHING BUT DOOR => OTHER ENTITY NOT IN DOORWAY
      // replace vacated cell with floor, handle entity
      if (destination.room !== 'door' && destination.type !== 'floor') {
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: oldRoom }, [x, y]);
        grid2 = utils.changeEntity(grid1, newHero, newPosition);
        this.props.actions.updateGrid(grid2, newPosition);
        this.props.actions.setCurrentEntity(destination);
        document.getElementById('entity').classList.remove('spin');
        this.draw();
        switch (destination.type) {
          case 'food':
            this.props.playSound('food');
            this.healthBoost(destination);
            break;
          case 'teamHero':
            this.props.playSound('addHero');
            this.addTeamHero(destination);
            break;
          case 'staircase':
            this.props.playSound('staircase');
            this.handleStaircase(destination);
            break;
          case 'candle':
            this.props.playSound('magicItem');
            this.handleCandle();
            break;
          case 'key':
            this.props.playSound('magicItem');
            this.handleKey();
            break;
          default:
        }
      }
    }
  }

  addTeamHero(teamHero) {
    const hero = { ...this.props.appState.hero };
    const messages = [...this.props.appState.messages];
    // const currentEntity = teamHero;
    hero.attack += teamHero.damage;
    hero.team.push(teamHero);
    messages.push(`You added ${teamHero.name} to your team! She adds ${teamHero.damage} points of damage to your team attack.`);
    this.props.actions.updateHero(hero);
    this.props.actions.updateMessages(messages);
    // this.props.actions.setCurrentEntity(currentEntity);
    document.getElementById('hero').classList.add('powerUp');
    setTimeout(() => {
      document.getElementById('hero').classList.remove('powerUp');
    }, 1000);
  }

  healthBoost(food) {
    const hero = { ...this.props.appState.hero };
    const messages = [...this.props.appState.messages];
    // const currentEntity = food;
    const healthBoost = food.healthBoost;
    hero.hp += healthBoost;
    // console.log(`new hero hp = ${hero.hp}`);
    messages.push(`You ate ${food.name} and gained ${food.healthBoost} health points!`);
    this.props.actions.updateHero(hero);
    // console.log(`hero hp after state update: ${this.props.appState.hero.hp}`);
    this.props.actions.updateMessages(messages);
    // this.props.actions.setCurrentEntity(currentEntity);
    document.getElementById('hero').classList.add('powerUp');
    setTimeout(() => {
      document.getElementById('hero').classList.remove('powerUp');
    }, 1000);
  }

  handleCandle() {
    const messages = [...this.props.appState.messages];
    messages.push('You found the magical Hanukkah candle!!!! Now the hidden Sufganiyah health boost is revealed -- you just have to find it.');
    this.props.actions.updateMessages(messages);
    this.props.actions.setCandle();
    document.getElementById('hero').classList.add('powerUp');
    setTimeout(() => {
      document.getElementById('hero').classList.remove('powerUp');
    }, 1000);
  }

  handleKey() {
    const messages = [...this.props.appState.messages];
    messages.push('You found the magical Key!!!! Now you can unlock the door to Trump\'s chambers and fight the final battle.');
    this.props.actions.updateMessages(messages);
    this.props.actions.setKey();
    document.getElementById('hero').classList.add('powerUp');
    setTimeout(() => {
      document.getElementById('hero').classList.remove('powerUp');
    }, 1000);
  }

  heroAttack(hero, monster, heroCoords, monsterCoords, door) {
    // console.log('hero attack');
    this.props.actions.setCurrentEntity(monster);
    const [hx, hy] = heroCoords;

    // set monster to combat = true
    // console.log(`${monster.name} to combat mode`);
    this.props.actions.updateCombat(monster.name, 'monster');

    // check if final battle
    const finalBattle = (monster.type === 'finalMonster');

    // generate random number for attack sound
    const sound = Math.floor(utils.random(1, 8));
    this.props.playSound(`combat${sound}`);

    // calculate damage and update monster health
    const monsterDamageTaken = Math.floor(hero.attack *
      utils.random(1, 1.3) * (((hero.level - 1) * 0.5) + 1));
    const newMonster = monster;
    newMonster.health -= monsterDamageTaken;

    // handle monster death
    if (newMonster.health < 0) {
      newMonster.health = 0;
      this.monsterDeath(hero, newMonster, monsterDamageTaken, monsterCoords, door);
      return;
    }

    // update monster health in app state after attack
    const entities = this.props.appState.entities;
    const [mx, my] = monsterCoords;
    entities[my][mx] = newMonster;

    // if final monster also update his other 3 blocks
    if (finalBattle) {
      const trumpPosition = [...this.props.appState.trumpPosition];
      const [mx0, my0] = trumpPosition[0];
      const [mx1, my1] = trumpPosition[1];
      const [mx2, my2] = trumpPosition[2];
      const [mx3, my3] = trumpPosition[3];

      const currentEntityViz = { ...monster, opacity: 1 };
      const currentEntityInv = { ...monster, opacity: 0 };

      entities[my0][mx0] = currentEntityViz;
      entities[my1][mx1] = currentEntityInv;
      entities[my2][mx2] = currentEntityInv;
      entities[my3][mx3] = currentEntityInv;
    }

    this.props.actions.updateEntities(entities);
    this.props.actions.setCurrentEntity(newMonster);

    // calculate shake animation
    const shakeClass = utils.shake[Math.floor(utils.random(0, 4))];
    const entityShake = shakeClass;
    const shakeDuration = utils.clamp(monsterDamageTaken * 9, 100, 500);
    document.getElementById('entity').classList.add(entityShake);
    setTimeout(() => {
      document.getElementById('entity').classList.remove(entityShake);
    }, shakeDuration);

    // save and display newest message
    const messages = [...this.props.appState.messages];
    messages.push(`Your team attacked ${monster.name}. He lost ${monsterDamageTaken} HP.`);
    this.props.actions.updateMessages(messages);

    // if monster is still alive and hero has not moved away
    if (this.props.appState.currentEntity.health > 0 &&
      this.props.appState.heroPosition[0] === hx && this.props.appState.heroPosition[1] === hy) {
      this.monsterAttack(monster, hero, monsterCoords);
    }
  }

  monsterAttack(monster, hero, monsterCoords) {
    const newHero = { ...hero };
    const newMonster = { ...monster };
    // generate random number for attack sound
    const sound = Math.floor(utils.random(1, 8));
    this.props.playSound(`combat${sound}`);

    // calculate hero damage
    const heroDamageTaken = Math.floor(utils.random(0.7, 1.3) * monster.damage);
    utils.changeEntity(this.props.appState.entities, monster, monsterCoords);
    newHero.hp -= heroDamageTaken;

    // calculate shake animation
    const shakeClass = utils.shake[Math.floor(utils.random(0, 4))];
    const heroShake = shakeClass;
    const shakeDuration = utils.clamp(heroDamageTaken * 9, 100, 500);
    document.getElementById('hero').classList.add(heroShake);
    setTimeout(() => {
      document.getElementById('hero').classList.remove(heroShake);
    }, shakeDuration);

    // update hero health in app state after attack
    this.props.actions.updateHero(newHero);

    // hero death
    if (this.props.appState.hero.hp <= 0) {
      this.heroDeath(monster);
      return;
    }

    // set combat to false in case hero walks away
    // will be reset to true if a new round starts
    this.props.actions.updateCombat('', '');

    // update changes to monster in app state
    const entities = this.props.appState.entities;
    const [mx, my] = monsterCoords;
    entities[my][mx] = newMonster;
    this.props.actions.updateEntities(entities);
    this.props.actions.setCurrentEntity(newMonster);

    // save and display newest messages
    const messages = [...this.props.appState.messages];
    messages.push(`${monster.name} attacked. You lost ${heroDamageTaken} HP.`);
    this.props.actions.updateMessages(messages);
  }

  heroDeath(monster) {
    // stop gameloop
    window.clearInterval(window.interval);
    cancelAnimationFrame(this.state.myReq);
    // define action for 'you died' screen
    const action = () => {
      this.props.actions.hideMsg();
      this.props.history.push('/');
      this.props.actions.restart();
    };
    document.getElementById('hero').classList.add('spin');
    this.props.playSound('heroDeath');

    // display message
    const messages = [...this.props.appState.messages];
    setTimeout(() => {
      messages.push(`${utils.badNews[Math.floor(utils.random(0, 13))]} You died! ${monster.youDiedMsg}.`);
      this.props.actions.updateMessages(messages);
      this.props.playSound('evilLaugh');
      this.props.actions.showMsg({
        title: 'You died!',
        imgUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/you-died.png',
        imgAlt: 'skull and crossbones',
        news: `${utils.badNews[Math.floor(utils.random(0, 13))]}!`,
        body1: `You were defeated by ${monster.name}`,
        body2: monster.bio,
        action,
        actionText: 'Play Again',
      });
      this.props.history.push('/gameover');
    }, 1000);
  }

  heroLevelUp(hero) {
    // add and remove powerup class
    document.getElementById('hero').classList.add('powerUp');
    document.getElementById('hero-level').classList.add('powerUp');
    setTimeout(() => {
      document.getElementById('hero').classList.remove('powerUp');
      document.getElementById('hero-level').classList.remove('powerUp');
    }, 2000);

    // display level up message
    const messages = [...this.props.appState.messages];
    messages.push(`Level UP!! Your team is now prepared to take on level ${hero.level} monsters.`);
    this.props.actions.updateMessages(messages);

    // update hero state in redux store with updated level & xp
    this.props.actions.updateHero(hero);
  }

  monsterDeath(hero, monster, monsterDamageTaken, monsterCoords, door) {
    // display message and update visuals in info panel
    document.getElementById('entity').classList.add('spin');
    this.props.playSound('heroDeath');
    const messages = [...this.props.appState.messages];
    messages.push(`${utils.goodNews[Math.floor(utils.random(0, 13))]}! Your attack of [${monsterDamageTaken}] defeated ${monster.name}. You gained 25XP.`);
    this.props.actions.updateMessages(messages);
    setTimeout(() => {
      document.getElementById('entity').classList.remove('spin');
    }, 1000);

    if (monster.type === 'finalMonster') {
      this.gameWin(monster, monsterDamageTaken);
      return;
    }

    // reset combat name in appState to empty string
    this.props.actions.updateCombat('', '');

    // update grid, replace hero with floor and monster w hero
    // unless hero's previous position was a door, in which case
    // replace hero with door
    let grid1;
    const [x, y] = this.props.appState.heroPosition;
    const oldRoom = this.props.appState.entities[y][x].room;
    if (door) {
      grid1 = utils.changeEntity(this.props.appState.entities, { type: 'door', room: 'door' }, [x, y]);
    } else {
      grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: oldRoom }, [x, y]);
    }
    const grid2 = utils.changeEntity(grid1, hero, monsterCoords);
    this.props.actions.updateGrid(grid2, monsterCoords);
    this.draw();

    // update xp slider
    const newHero = { ...hero };
    newHero.xp += 25;
    updateXP(newHero.xp);
    this.props.actions.updateHero(newHero);

    // update hero level
    if (newHero.xp % 100 === 0) {
      newHero.level = this.props.appState.hero.level + 1;
      this.heroLevelUp(newHero);
    }
  }

  gameWin(monster, monsterDamageTaken) {
    // stop gameloop
    this.pause();
    // define action for 'you won' screen
    const action = () => {
      this.props.actions.hideMsg();
      this.props.history.push('/');
      this.props.actions.restart();
    };
    const messages = [...this.props.appState.messages];
    messages.push(`${utils.goodNews[Math.floor(utils.random(0, 13))]}! Your attack of [${monsterDamageTaken}] defeated ${monster.name}.`); // fix this msg later
    this.props.playSound('gameWin');
    setTimeout(() => {
      // document.getElementById('msgTitle').classList.remove('powerUp');
      // document.getElementById('msgTitle').classList.remove('blink');
      this.props.actions.showMsg({
        title: 'You won!',
        imgUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/rainbow.png',
        imgAlt: 'rainbow',
        news: `${utils.goodNews[Math.floor(utils.random(0, 13))]}!`,
        body1: 'You and your team defeated the biggest monster of all! Great work!',
        body2: null,
        action,
        actionText: 'Play Again',
      });
      this.props.history.push('/gameover');
    }, 1005);
  }

  handleCombat(monster, monsterCoords, heroCoords, init, door) {
    // set monster combat value to true
    this.props.actions.updateCombat(monster.name, init);

    // update current entity in info panel
    this.props.actions.setCurrentEntity(monster);

    // set combat flow
    if (init === 'hero') {
      // hero attacks first
      this.heroAttack(this.props.appState.hero, monster, heroCoords, monsterCoords, door);
      return;
    }
    // otherwise, monster attacks first
    this.monsterAttack(monster, this.props.appState.hero, monsterCoords);
  }

  handleStaircase() {
    document.getElementById('board').classList.add('staircaseSpin');
    const messages = [...this.props.appState.messages];
    const currentEntity = {
      type: 'staircase',
      name: 'staircase',
      cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/staircase_200.png',
      message: `Staircase down to level ${this.props.appState.gameLevel + 1}` };
    this.props.actions.setCurrentEntity(currentEntity);
    const level = this.props.appState.gameLevel;
    messages.push(`You found the staircase down to level ${this.props.appState.gameLevel + 1}!`);
    this.props.actions.updateMessages(messages);
    const { newMap, heroPosition, trumpPosition, doors,
      finalMonsterRoom } = fillGrid(generateMap(level + 1),
      level + 1, this.props.appState.hero);
    this.props.actions.handleStaircase(currentEntity,
      heroPosition, trumpPosition, newMap, level + 1, doors, finalMonsterRoom);
    document.getElementById('subhead').classList.add('powerUp');
    setTimeout(() => {
      this.draw();
    }, 1000);
    setTimeout(() => {
      document.getElementById('board').classList.remove('staircaseSpin');
      document.getElementById('subhead').classList.remove('powerUp');
    }, 2000);
  }

  // called from this.update()
  monsterMovement(entities, entity, coords, prevChange) {
    if (this.props.appState.combatName === entity.name && this.props.appState.gridFilled) {
      return;
    }
    if (this.props.appState.running && this.props.appState.combatName !== entity.name) {
      // define constants
      // console.log(`monsterMovement ${entity.name}`);
      const newEntity = { ...entity };
      const [x, y] = coords;
      const oldRoom = entities[y][x].room;
      const [changeX, changeY] = prevChange;
      const newPosition = [changeX + x, changeY + y]; // new coordinates
      const destination = entities[y + changeY][x + changeX]; // what's there
      let grid1; // for updating render at end of method

      // FLOOR => FLOOR
      // HERO => FLOOR
      // just replace vacated cell with floor
      if (destination.type === 'floor' && entity.room !== 'door') {
        // console.log(`${entity.name} FLOOR => FLOOR`);
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: oldRoom }, coords);
      }

      // FLOOR => HERO IN DOORWAY
      // replace vacated cell with floor, handle doorway, handle combat
      if (destination.type === 'hero' && destination.room === 'door') {
        // console.log(`${entity.name} FLOOR => HERO IN DOORWAY`);
        // newEntity.room = 'door';
        newEntity.combat = true;
        this.props.actions.updateEntity(newEntity, coords);
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: oldRoom }, coords);
        this.props.actions.setCurrentEntity(newEntity);
        document.getElementById('entity').classList.remove('spin');
        this.handleCombat(newEntity, coords, newPosition, newEntity.name);
        return;
      }

      // FLOOR => DOOR
      // HERO => DOOR
      // change room type to door, replace vacated cell with floor
      if (destination.room === 'door' && (destination.type === 'door' || destination.type === 'floor')) {
        // console.log(`${entity.name} FLOOR (${Math.floor(oldRoom)})=> DOOR`);
        newEntity.room = 'door';
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: oldRoom }, coords);
      }

      // FLOOR => HERO
      // handle combat, replace vacated cell with floor
      if (destination.type === 'hero' && destination.room !== 'door') {
        // console.log(`${entity.name} FLOOR => HERO`);
        this.props.actions.updateCombat(newEntity.name, 'monster');
        this.props.actions.setCurrentEntity(newEntity);
        document.getElementById('entity').classList.remove('spin');
        this.handleCombat(newEntity, coords, newPosition, newEntity.name);
        return;
      }

      // DOOR => FLOOR
      // replace vacated cell with door
      if (entity.room === 'door' && destination.type === 'floor') {
        // console.log(`${entity.name} DOOR => FLOOR`);
        newEntity.room = this.props.appState.entities[changeY + y][changeX + x].room;
        this.props.actions.updateEntity(newEntity, coords);
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'door', room: 'door' }, coords);
      }

      // DOOR => HERO
      // replace vacated cell with door, handle combat
      if (entity.room === 'door' && destination.type === 'hero') {
        // console.log(`${entity.name} DOOR => HERO`);
        // newEntity.room = this.props.appState.entities[y][x].room;
        newEntity.combat = true;
        this.props.actions.updateEntity(newEntity, coords);
        this.props.actions.setCurrentEntity(newEntity);
        document.getElementById('entity').classList.remove('spin');
        this.handleCombat(newEntity, coords, newPosition, newEntity.name, true);
        return;
      }

      newEntity.prevChange = prevChange;

      // save updated entity info to app state
      const grid2 = utils.changeEntity(grid1, newEntity, newPosition);
      this.props.actions.updateEntities(grid2);
    }
  }

  gameLoop(timestamp, grid2, newPosition) {
    // console.log('gameloop');
    if (this.props.appState.running) {
      // console.log('gl running');
      // const progress = timestamp - lastRender;
      this.update(grid2, newPosition);
      this.draw();
      // lastRender = timestamp;
      setTimeout(() => {
        const myReq = requestAnimationFrame(() => {
          this.gameLoop(timestamp,
            this.props.appState.entities, this.props.appState.heroPosition);
        });
        this.setState({ myReq });
      }, 1000);
    } else {
      console.log('not running');
    }
  }

  update(grid2, newPosition) {
    // if (this.props.appState.gridFilled) {
    // console.log('update');
    // update position and object values for hero and all entities
    // for time elapsed since last render
    const currentEntities = this.props.appState.entities;
    const heroPosition = this.props.appState.heroPosition;
    const doors = this.props.appState.doors;

    // calculate hero movement
    this.props.actions.updateEntities(currentEntities, newPosition);

    // calculate monster movement only if doors has populated from fillGrid
    if (doors && doors.length) {
      // store each monster's target move in an array
      // if a second monster tries to move into the same cell
      // disable his movement for that turn
      const monsterMoves = [];
      currentEntities.map((row, rIdx) => {
        row.map((cell, cIdx) => {
        // don't move monsters who are currently in combat
          if (cell.type === 'monster' && cell.name !==
          this.props.appState.combat) {
            // choose next move in monsterAI algorithm
            const heroRoom = this.props.appState.hero.room;
            const newMonsterPosition = utils.monsterAI(currentEntities,
              [cIdx, rIdx], heroPosition, doors, heroRoom, cell.prevChange);

            // if no other monster has already moved into that cell
            if (newMonsterPosition && !utils.isItemInArray(monsterMoves, newMonsterPosition)) {
              // calculate change
              const change = [newMonsterPosition[0] - cIdx, newMonsterPosition[1] - rIdx];
              // move monster to new position and re-render viewport
              this.monsterMovement(currentEntities, cell, [cIdx, rIdx], change);
              // save move to array for this turn to check future moves against
              monsterMoves.push(newMonsterPosition);
            }
          }
          return null;
        });
        return null;
      });
    }
    // }
  }

  play() {
    this.props.actions.play();
    const myReq = requestAnimationFrame(this.gameLoop);
    this.setState({ myReq });
  }

  pause() {
    // console.log('paused');
    // stop gameloop
    window.clearInterval(window.interval);
    cancelAnimationFrame(this.state.myReq);
    this.props.actions.pause();
  }

  startGame() {
    const { newMap, heroPosition, trumpPosition, doors } =
      fillGrid(generateMap(1), 1, this.props.appState.hero);
    this.props.actions.start(newMap, heroPosition, trumpPosition, doors);
  }

  draw(resize) {
    if (this.props.appState.gridFilled) {
      let prevVP;
      // render current viewport
      // save current viewport as 'prevVP'

      // if window has been resized since last render,
      // prevVP = null (full re-render)
      if (resize) {
        prevVP = utils.renderViewport(this.props.appState.heroPosition,
        this.props.appState.entities, this.props.appState.cellSize,
        null, this.props.appState.candle, this.props.appState.key);
      } else {
        // otherwise, use prevVP to decide which cells to render in this round
        prevVP = utils.renderViewport(this.props.appState.heroPosition,
          this.props.appState.entities, this.props.appState.cellSize,
          this.props.appState.prevVP, this.props.appState.candle, this.props.appState.key);
      }
      // save prevVP to app state to compare against next viewport
      // and only draw diff
      this.props.actions.setPrevVP(prevVP);
    } else {
      console.log('grid not filled, not drawing');
    }
  }

  render() {
    const clipRadius = this.props.appState.clipSize / 2;
    const cellSize = this.props.appState.cellSize;
    const messages = [...this.props.appState.messages];
    const messageList = messages.map(message => (
      <li key={shortid.generate()} className="message__item">
        {message}
      </li>));
    let canvasStyle = {};
    if (this.props.appState.torch) {
      canvasStyle = {
        clipPath: `circle(${clipRadius}px at center)`,
      };
    }
    return (
      <div>
        { this.state.modal &&
          <div className="modal">
            <button
              className="modal__close aria-button"
              onClick={() => {
                this.props.playSound('movement');
                this.closeModal();
              }}
            >&times;</button>
            <div className="modal__header">Game paused</div>
            <div className="modal__btn-wrap">
              <button
                className="big-msg__btn"
                onClick={() => {
                  this.props.playSound('movement');
                  this.closeModal();
                  this.play();
                }}
              >Resume</button>
            </div>
          </div>
        }
        <div className="container">
          <div className="col col--narrow">
            <InfoLeft
              hero={this.props.appState.hero}
              header=""
            />
          </div>
          <div className="col col--wide" id="colWide">
            <div className="info__controls">
              <span className="info__subhead" id="subhead">Level:&nbsp;{this.props.appState.gameLevel}</span>
              <div className="info__icons-wrap">
                <button
                  className="aria-button info__icon"
                  onClick={
                    () => {
                      this.props.playSound('movement');
                      if (this.props.appState.running) {
                        this.openModal();
                        this.props.actions.pause();
                      }
                    }}
                  aria-label="pause"
                  title="pause"
                >
                  <i className="icon icon-pause ctrl-icon" />
                </button>
                <button
                  className="aria-button info__icon"
                  onClick={
                    () => {
                      this.props.playSound('movement');
                      window.clearInterval(window.interval);
                      this.props.actions.restart();
                      this.props.history.push('/');
                    }}
                  aria-label="restart game"
                  title="restart game"
                >
                  <i className="icon icon-sync ctrl-icon" />
                </button>
                <button
                  className="aria-button info__icon"
                  onClick={
                    () => {
                      this.props.playSound('movement');
                      this.props.actions.toggleSound(this.props.appState.sound);
                    }}
                  aria-label="toggle sound"
                  title="toggle sound"
                >
                  <i className={this.props.appState.sound ? 'icon icon-volume_off ctrl-icon' : 'icon icon-volume_up ctrl-icon'} />
                </button>
                <button
                  className="aria-button info__icon"
                  onClick={
                    () => {
                      this.props.playSound('movement');
                      this.props.actions.toggleTorch(this.props.appState.torch);
                    }}
                  aria-label="toggle torch"
                  title="toggle torch"
                >
                  <i className="icon icon-flashlight ctrl-icon" />
                </button>
                <a
                  className="aria-button info__icon"
                  href="https://github.com/rifkegribenes/dungeon-crawler"
                  rel="noopener noreferrer"
                  target="_blank"
                  title="github"
                >
                  <i className="icon icon-github ctrl-icon" />
                </a>
              </div>
            </div>
            <canvas
              id="board"
              className="board"
              width={20 * cellSize}
              height={20 * cellSize}
              style={canvasStyle}
            />
          </div>
          <div className="col col--narrow">
            <InfoRight
              entity={this.props.appState.currentEntity}
              header={this.props.appState.header}
            />
            <div className="message">
              <ul className="message__list">
                {messageList.reverse()}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions }, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Board));
