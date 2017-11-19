import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import shortid from 'shortid';
import { withRouter } from 'react-router';

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
    };

    this.handleKeydown = this.handleKeydown.bind(this);
    this.userInput = this.userInput.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    // this.step = this.step.bind(this);
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
    console.log('cDU');
    if (!prevProps.appState.gridFilled) {
      console.log('!prevProps.appState.gridFilled');
      if (this.props.appState.gridFilled) {
        console.log('gridFilled');
        this.play();
      }
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
    utils.renderViewport(this.props.appState.heroPosition,
      this.props.appState.entities, this.props.appState.cellSize);
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
    console.log(`new hero position: ${newPosition}`);
    const newHero = this.props.appState.entities[y][x];
    const destination = this.props.appState.entities[y + changeY][x + changeX];
    if (destination.type !== 'wall' && destination.type !== 'monster' && destination.type !== 'finalMonster') {
      // check if prevPos was a door
      let grid1;
      if (oldRoom === 'door') {
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'door', room: 'door' }, [x, y]);
      } else {
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: oldRoom }, [x, y]);
      }
      const grid2 = utils.changeEntity(grid1, newHero, newPosition);
      this.props.actions.updateGrid(grid2, newPosition);
      this.draw();
    }

    // handle collisions
    if (destination.room === 'door' && destination.type === 'door') {
      console.log(`${this.props.appState.hero.name} FLOOR => DOOR`);
      newHero.room = 'door';
      const grid1 = utils.changeEntity(this.props.appState.entities,
      { type: 'floor', room: 'door' }, [x, y]);
      const grid2 = utils.changeEntity(grid1, newHero, newPosition);
      this.props.actions.updateEntities(grid2, newPosition);
    }
    console.log(destination.type);
    console.log(destination.room);
    switch (destination.type) {
      case 'finalMonster':
      case 'monster':
        this.props.actions.setCurrentEntity(destination);
        document.getElementById('entity').classList.remove('spin');
        console.log('calling handle combat');
        console.log(destination);
        console.log(newPosition);
        this.handleCombat(destination, newPosition);
        break;
      case 'food':
        this.props.playSound('food');
        this.props.actions.setCurrentEntity(destination);
        document.getElementById('entity').classList.remove('spin');
        this.healthBoost(destination);
        break;
      case 'teamHero':
        this.props.playSound('addHero');
        this.props.actions.setCurrentEntity(destination);
        document.getElementById('entity').classList.remove('spin');
        this.addTeamHero(destination);
        break;
      case 'staircase':
        this.props.playSound('staircase');
        this.props.actions.setCurrentEntity(destination);
        document.getElementById('entity').classList.remove('spin');
        this.handleStaircase(destination);
        break;
      default:
    }
  }

  addTeamHero(teamHero) {
    const hero = { ...this.props.appState.hero };
    const messages = [...this.props.appState.messages];
    const currentEntity = teamHero;
    hero.attack += teamHero.damage;
    hero.team.push(teamHero);
    messages.push(`You added ${teamHero.name} to your team! She adds ${teamHero.damage} points of damage to your team attack.`);
    this.props.actions.updateHero(hero);
    this.props.actions.updateMessages(messages);
    this.props.actions.setCurrentEntity(currentEntity);
    document.getElementById('hero').classList.add('powerUp');
    setTimeout(() => {
      document.getElementById('hero').classList.remove('powerUp');
    }, 1000);
  }

  healthBoost(food) {
    const hero = { ...this.props.appState.hero };
    const messages = [...this.props.appState.messages];
    const currentEntity = food;
    const healthBoost = food.healthBoost;
    hero.hp += healthBoost;
    messages.push(`You ate ${food.name} and gained ${food.healthBoost} health points!`);
    this.props.actions.updateHero(hero);
    this.props.actions.updateMessages(messages);
    this.props.actions.setCurrentEntity(currentEntity);
    document.getElementById('hero').classList.add('powerUp');
    setTimeout(() => {
      document.getElementById('hero').classList.remove('powerUp');
    }, 1000);
  }

  heroAttack(hero, monster, heroCoords, monsterCoords) {
    console.log('heroAttack');
    const [hx, hy] = heroCoords;

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
      this.monsterDeath(hero, newMonster, monsterDamageTaken, monsterCoords);
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
    this.props.actions.setCurrentEntity(monster);

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
    this.props.actions.setCurrentEntity(entities[my][mx]);

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
      messages.push(`You died! ${monster.youDiedMsg}.`);
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

  monsterDeath(hero, monster, monsterDamageTaken, monsterCoords) {
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

    // update grid, replace monster with floor and move hero into it
    const [x, y] = this.props.appState.heroPosition;
    const grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor' }, [x, y]);
    const grid2 = utils.changeEntity(grid1, hero, monsterCoords);
    this.props.actions.updateGrid(grid2, monsterCoords);
    utils.renderViewport(this.props.appState.heroPosition,
      this.props.appState.entities, this.props.appState.cellSize);

    // update xp slider
    const newHero = { ...hero };
    newHero.xp += 25;
    updateXP(newHero.xp);

    // update hero level
    newHero.level = Math.floor(hero.xp / 100) + 1;
    if (newHero.xp % 100 === 0) {
      this.heroLevelUp(newHero);
    }
  }

  gameWin(monster, monsterDamageTaken) {
    // stop gameloop
    window.clearInterval(window.interval);
    cancelAnimationFrame(this.state.myReq);
    // define action for 'you won' screen
    const action = () => {
      this.props.actions.hideMsg();
      this.props.history.push('/');
      this.props.actions.restart();
    };
    const messages = [...this.props.appState.messages];
    messages.push(`${utils.goodNews[Math.floor(utils.random(0, 13))]}! Your attack of [${monsterDamageTaken}] defeated ${monster.name}.`); // fix this msg later
    setTimeout(() => messages.push('You won! blah blah blah.'), 1000); // fix this msg later
    this.props.playSound('gameWin');
    setTimeout(() => {
      document.getElementById('msgTitle').classList.remove('powerUp');
      document.getElementById('msgTitle').classList.remove('blink');
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
    }, 1000);
  }

  handleCombat(monster, monsterCoords, heroCoords, init) {
    console.log('handleCombat');

    // set monster combat value to true
    let initiator = init;
    if (!initiator) { initiator = 'hero'; }
    console.log(initiator);
    this.props.actions.updateCombat(monster.name, initiator);

    // update current entity in info panel
    this.props.actions.setCurrentEntity(monster);

    // set combat flow
    if (initiator === 'hero') {
      // hero attacks first
      this.heroAttack(this.props.appState.hero, monster, heroCoords, monsterCoords);
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
    const { newMap, heroPosition, trumpPosition, doors } = fillGrid(generateMap(level + 1),
      level + 1, this.props.appState.hero);
    this.props.actions.handleStaircase(currentEntity,
      heroPosition, trumpPosition, newMap, level + 1, doors);
    document.getElementById('subhead').classList.add('powerUp');
    setTimeout(() => {
      utils.renderViewport(this.props.appState.heroPosition,
        this.props.appState.entities, this.props.appState.cellSize);
    }, 1000);
    setTimeout(() => {
      document.getElementById('board').classList.remove('staircaseSpin');
      document.getElementById('subhead').classList.remove('powerUp');
    }, 2000);
  }

  monsterMovement(entities, entity, coords, prevChange) {
    if (this.props.appState.combat === entity.name && this.props.appState.gridFilled) {
      console.log(`${entity.name} is in combat and is not moving`);
      return;
    }
    if (this.props.appState.running && this.props.appState.combat !== entity.name) {
      // define constants
      const newEntity = { ...entity };
      const [x, y] = coords;
      const [changeX, changeY] = prevChange;
      const newPosition = [changeX + x, changeY + y]; // new coordinates
      const destination = entities[y + changeY][x + changeX]; // what's there
      let grid1; // for updating render at end of method
      console.log(`${entity.name}: room ${entity.room}`);

      // FLOOR => FLOOR
      // HERO => FLOOR
      // just replace vacated cell with floor
      if (destination.type === 'floor' && entity.room !== 'door') {
        console.log(`${entity.name} FLOOR => FLOOR`);
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: entity.room }, coords);
      }

      // FLOOR => HERO IN DOORWAY
      // replace vacated cell with floor, handle doorway, handle combat
      if (destination.type === 'hero' && destination.room === 'door') {
        console.log(`${entity.name} FLOOR => HERO IN DOORWAY`);
        newEntity.room = 'door';
        newEntity.combat = true;
        this.props.actions.updateEntity(newEntity, coords);
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: entity.room }, coords);
        this.props.actions.setCurrentEntity(newEntity);
        document.getElementById('entity').classList.remove('spin');
        this.handleCombat(newEntity, coords, newPosition, newEntity.name);
        return;
      }

      // FLOOR => DOOR
      // HERO => DOOR
      // change room type to door, replace vacated cell with floor
      if (destination.room === 'door' && destination.type === 'door') {
        console.log(`${entity.name} FLOOR => DOOR`);
        newEntity.room = 'door';
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: entity.room }, coords);
      }

      // FLOOR => HERO
      // handle combat
      if (destination.type === 'hero' && destination.room !== 'door') {
        console.log(`${entity.name} FLOOR => HERO`);
        this.props.actions.updateCombat(newEntity.name);
        console.log(`updating ${entity.name} to combat state`);
        this.props.actions.setCurrentEntity(newEntity);
        document.getElementById('entity').classList.remove('spin');
        this.handleCombat(newEntity, coords, newPosition, newEntity.name);
        return;
      }

      // DOOR => FLOOR
      // replace vacated cell with door
      if (entity.room === 'door' && destination.type === 'floor') {
        console.log(`${entity.name} DOOR => FLOOR`);
        newEntity.room = this.props.appState.entities[changeY + y][changeX + x].room;
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'door', room: entity.room }, coords);
      }

      // DOOR => HERO
      // replace vacated cell with door, handle combat
      if (entity.room === 'door' && destination.type === 'hero') {
        console.log(`${entity.name} DOOR => HERO`);
        newEntity.room = this.props.appState.entities[y][x].room;
        newEntity.combat = true;
        this.props.actions.setCurrentEntity(newEntity);
        document.getElementById('entity').classList.remove('spin');
        this.handleCombat(newEntity, coords, newPosition, newEntity.name);
        return;
      }

      newEntity.prevChange = prevChange;

      // save updated entity info to app state
      console.log('passing these args to changeEntity:');
      console.log(grid1);
      console.log(newEntity);
      console.log(newPosition);
      const grid2 = utils.changeEntity(grid1, newEntity, newPosition);
      this.props.actions.updateEntities(grid2);
    }
  }

  gameLoop(timestamp, grid2, newPosition) {
    if (this.props.appState.running) {
      // const progress = timestamp - lastRender;
      console.log('GAMELOOP@@@@@@@@@@@@@@@@@@@@@@@@@@@');
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
    }
  }

  update(grid2, newPosition) {
    // if (this.props.appState.gridFilled) {
    console.log('update');
      // update position and object values for hero and all entities
      // for time elapsed since last render
    const currentEntities = this.props.appState.entities;
    const heroPosition = this.props.appState.heroPosition;
    const doors = this.props.appState.doors;

      // calculate hero movement
    this.props.actions.updateEntities(currentEntities, newPosition);

      // calculate monster movement
    currentEntities.map((row, rIdx) => {
      row.map((cell, cIdx) => {
        // don't move monsters who are currently in combat
        if (cell.type === 'monster' && cell.name !==
          this.props.appState.combat) {
            // choose next move in monsterAI algorithm
          const heroRoom = this.props.appState.hero.room;
          const newMonsterPosition = utils.monsterAI(currentEntities,
              [cIdx, rIdx], heroPosition, doors, heroRoom, cell.prevChange);

            // calculate change
          if (newMonsterPosition) {
            const change = [newMonsterPosition[0] - cIdx, newMonsterPosition[1] - rIdx];
              // move monster to new position and re-render viewport
            this.monsterMovement(currentEntities, cell, [cIdx, rIdx], change);
          }
        }
        return null;
      });
      return null;
    });
    // }
  }

  play() {
    this.props.actions.play();
    console.log('running');
    const myReq = requestAnimationFrame(this.gameLoop);
    this.setState({ myReq });
  }

  pause() {
    console.log('paused');
    window.clearInterval(window.interval);
    cancelAnimationFrame(this.state.myReq);
    this.props.actions.pause();
  }

  startGame() {
    const { newMap, heroPosition, trumpPosition, doors } =
      fillGrid(generateMap(1), 1, this.props.appState.hero);
    this.props.actions.start(newMap, heroPosition, trumpPosition, doors);
  }

  draw() {
    console.log('draw');
    if (this.props.appState.gridFilled) {
      utils.renderViewport(this.props.appState.heroPosition,
        this.props.appState.entities, this.props.appState.cellSize);
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
                      this.props.playSound('uiSelect');
                      if (this.props.appState.running) {
                        this.props.actions.pause();
                        return;
                      }
                      this.props.actions.play();
                    }}
                  aria-label="pause"
                  title="pause"
                >
                  &#9208;
                </button>
                <button
                  className="aria-button info__icon"
                  onClick={
                    () => {
                      this.props.playSound('uiSelect');
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
                      this.props.playSound('uiSelect');
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
                      this.props.playSound('uiSelect');
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
