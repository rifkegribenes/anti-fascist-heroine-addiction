import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import shortid from 'shortid';
import { withRouter } from 'react-router';

import * as Actions from '../store/actions';
import InfoLeft from './InfoLeft';
import InfoRight from './InfoRight';
import BigMsg from './BigMsg';
import * as utils from '../utils/index';
import generateMap from '../utils/mapgen';
import fillGrid from '../utils/fillGrid';
// import * as aL from '../utils/asset_loader';


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
    this.step = this.step.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
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

  componentDidUpdate() {
    if (this.props.appState.gridFilled) {
      utils.renderViewport(this.props.appState.heroPosition,
        this.props.appState.entities, this.props.appState.cellSize);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('resize', this.updateDimensions);
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
      this.props.actions.userInput(grid2, newPosition);
    }
    // handle collisions
    switch (destination.type) {
      case 'finalMonster':
      case 'monster':
        this.props.actions.setCurrentEntity(destination);
        document.getElementById('entity').classList.remove('spin');
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
      case 'door':
        this.handleDoor([...newPosition], change, this.props.appState.hero);
        break;
      default:
    }
  }

  handleDoor(doorCoords, entity) {
    const [dx, dy] = doorCoords;
    // change the room id of the entity or hero
    console.log(`${entity.name} IS IN A DOORWAY`);
    if (entity.type === 'hero') {
      const newHero = { ...this.props.appState.hero };
      newHero.room = 'door';
      this.props.actions.updateHero(newHero);
    } else if (entity.type === 'monster') {
      const newEntity = { ...entity };
      newEntity.room = 'door';
      const newEntities = [...this.props.appState.entities];
      newEntities[dy][dx] = newEntity;
      console.log(`${newEntity.name}'s new room is ${newEntity.room}`);
      this.props.actions.updateEntities(newEntities);
      console.log(`after state update, cell prev containing door is now:`);
      console.log(this.props.appState.entities[dy][dx]);
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

  handleCombat(monster, newPosition) {
    // copy monster so it can be modified in combat
    const currentMonster = { ...monster };
    // set monster combat value to true
    currentMonster.combat = true;
    // define action for 'you died' and 'you won' screens
    const action = () => {
      this.props.actions.hideMsg();
      this.props.history.push('/');
      this.props.actions.restart();
    };

    // check if final battle
    const finalBattle = (monster.type === 'finalMonster');

    // get values for hero and messages from app state
    const hero = { ...this.props.appState.hero };
    const messages = [...this.props.appState.messages];

    this.props.actions.setCurrentEntity(currentMonster);

    // save message to display later in info panel
    messages.push(`Your team is attacking ${monster.name}!`);

    // check hero level
    const heroLevel = Math.floor(hero.xp / 100) + 1;

    // HERO ATTACK //

    // generate random number for attack sound
    let sound = Math.floor(utils.random(1, 8));
    this.props.playSound(`combat${sound}`);

    // calculate damage and update monster health
    const monsterDamageTaken = Math.floor(hero.attack *
      utils.random(1, 1.3) * (((heroLevel - 1) * 0.5) + 1));
    const currentEntity = monster;
    currentEntity.health -= monsterDamageTaken;

    // monster can't have negative health
    if (currentEntity.health < 0) {
      currentEntity.health = 0;
    }

    // update monster health in app state after attack
    let entities = this.props.appState.entities;
    const [mx, my] = newPosition;
    entities[my][mx] = currentEntity;

    // if final monster also update his other 3 blocks
    if (finalBattle) {
      const trumpPosition = [...this.props.appState.trumpPosition];
      // console.log(trumpPosition);
      const [mx0, my0] = trumpPosition[0];
      const [mx1, my1] = trumpPosition[1];
      const [mx2, my2] = trumpPosition[2];
      const [mx3, my3] = trumpPosition[3];

      const currentEntityViz = { ...currentEntity, opacity: 1 };
      const currentEntityInv = { ...currentEntity, opacity: 0 };

      entities[my0][mx0] = currentEntityViz;
      entities[my1][mx1] = currentEntityInv;
      entities[my2][mx2] = currentEntityInv;
      entities[my3][mx3] = currentEntityInv;
    }

    this.props.actions.updateEntities(entities);
    this.props.actions.setCurrentEntity(currentEntity);

    // calculate shake animation
    const shake = ['shake', 'shake-hard', 'shake-rotate', 'shake-crazy'];
    let shakeClass = shake[Math.floor(utils.random(0, 4))];
    const entityShake = shakeClass;
    let shakeDuration = utils.clamp(monsterDamageTaken * 9, 100, 500);
    document.getElementById('entity').classList.add(entityShake);
    setTimeout(() => {
      document.getElementById('entity').classList.remove(entityShake);
    }, shakeDuration);

    // if monster is still alive...
    if (this.props.appState.currentEntity.health > 0) {
      // MONSTER ATTACK //

      // generate random number for attack sound
      sound = Math.floor(utils.random(1, 8));
      this.props.playSound(`combat${sound}`);

      const heroDamageTaken = Math.floor(utils.random(0.7, 1.3) * currentEntity.damage);
      utils.changeEntity(this.props.appState.entities, monster, newPosition);
      hero.hp -= heroDamageTaken;

      // calculate shake animation
      shakeClass = shake[Math.floor(utils.random(0, 4))];
      const heroShake = shakeClass;
      shakeDuration = utils.clamp(heroDamageTaken * 9, 100, 500);
      document.getElementById('hero').classList.add(heroShake);
      setTimeout(() => {
        document.getElementById('hero').classList.remove(heroShake);
      }, shakeDuration);

      // update hero health in app state after attack
      this.props.actions.updateHero(hero);

      // set monster combat to false in case hero walks away
      // will be reset to true if a new round starts
      currentEntity.combat = false;
      entities = this.props.appState.entities;
      entities[my][mx] = currentEntity;
      this.props.actions.updateEntities(entities);
      this.props.actions.setCurrentEntity(entities[my][mx]);

      // save and then display newest messages
      messages.push(`Your team attacked ${currentEntity.name}. He lost ${monsterDamageTaken} HP.
      ${currentEntity.name} hit back. You lost ${heroDamageTaken} HP.`);
      this.props.actions.updateMessages(messages);

      // HANDLE HERO DEATH //
      // display message
      if (hero.hp - heroDamageTaken <= 0) {
        document.getElementById('hero').classList.add('spin');
        this.props.playSound('heroDeath');
        setTimeout(() => {
          messages.push(`You died! ${currentEntity.youDiedMsg}.`);
          this.props.actions.updateMessages(messages);
          this.props.playSound('evilLaugh');
          this.props.actions.showMsg({
            title: 'You died!',
            imgUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/you-died.png',
            imgAlt: 'skull and crossbones',
            news: `${utils.badNews[Math.floor(utils.random(0, 13))]}!`,
            body1: `You were defeated by ${currentEntity.name}`,
            body2: currentEntity.bio,
            action,
            actionText: 'Play Again',
          });
        }, 1000);
        return;
      }

       // HANDLE MONSTER DEATH //
    } else if (currentEntity.health <= 0) {
      document.getElementById('entity').classList.add('spin');
      this.props.playSound('heroDeath');
      setTimeout(() => {
        document.getElementById('entity').classList.remove('spin');
      }, 1000);

      // update grid, replace monster with floor and move hero into it
      const [x, y] = this.props.appState.heroPosition;
      const grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor' }, [x, y]);
      const grid2 = utils.changeEntity(grid1, hero, newPosition);
      this.props.actions.updateGrid(grid2, newPosition);
      utils.renderViewport(this.props.appState.heroPosition,
        this.props.appState.entities, this.props.appState.cellSize);

      // update xp slider
      hero.xp += 25;
      updateXP(hero.xp);

      // update hero level
      hero.level = Math.floor(hero.xp / 100) + 1;
      if (hero.xp % 100 === 0) {
        // add and remove powerup class
        document.getElementById('hero').classList.add('powerUp');
        document.getElementById('hero-level').classList.add('powerUp');
        setTimeout(() => {
          document.getElementById('hero').classList.remove('powerUp');
          document.getElementById('hero-level').classList.remove('powerUp');
        }, 2000);

        // display level up message
        messages.push(`Level UP!! Your team is now prepared to take on level ${hero.level} monsters.`);
        this.props.actions.updateMessages(messages);

        // update hero state in redux store with updated level & xp
        this.props.actions.updateHero(hero);

        // this.props.actions.setCurrentEntity(currentEntity);
        // what happens if we remove this line? ^^
      }

       // HANDLE GAME WIN  //
      if (monster.type === 'finalMonster') {
        messages.push(`You did it! Your attack of [${monsterDamageTaken}] defeated ${currentEntity.name}.`); // fix this msg later
        setTimeout(() => messages.push('You won! blah blah blah.'), 1000); // fix this msg later
        this.props.playSound('gameWin');
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
        setTimeout(() => {
          document.getElementById('msgTitle').classList.remove('powerUp');
          document.getElementById('msgTitle').classList.remove('blink');
        }, 1000);
        return;
      }
      messages.push(`You did it! Your attack of [${monsterDamageTaken}] defeated ${currentEntity.name}.`); // fix this msg later
      setTimeout(() => messages.push('You gained 10XP.'), 1000); // fix this msg later
      // TODO: level up screen
      if ((hero.xp + 10) % 100 === 0) {
        setTimeout(() => messages.push('LEVEL UP!'), 3000);
      }
    }
    this.props.actions.updateMessages(messages);
    this.props.actions.updateHero(hero);
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
    if (this.props.appState.running && !entity.combat) {
      let change = prevChange;
      if (!change) { change = [0, 0]; }
      console.log(`monsterMovement change: ${change}`);
      const [x, y] = coords;
      const oldRoom = entity.room;
      const [changeX, changeY] = change;
      const newPosition = [changeX + x, changeY + y]; // new coordinates
      const destination = entities[y + changeY][x + changeX]; // what's there
      console.log(`destination: ${destination.type} at ${newPosition}`);
      if (destination.type === 'door') {
        console.log(`${entity.name} is about to go through a door`);
        this.handleDoor([...newPosition], entity);
      }
      if (destination.type === 'floor' ||
        destination.type === 'door' ||
        destination.type === 'hero') {
        // check if prevPos was a door
        let grid1;
        if (oldRoom === 'door') {
          console.log('previous location was a door');
          grid1 = utils.changeEntity(this.props.appState.entities, { type: 'door', room: 'door' }, coords);
        } else {
          grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: oldRoom }, coords);
        }
        console.log(`${entity.name}'s new position is ${newPosition}`);
        console.log(`saving prevChange of ${change} to ${entity.name}`);
        const newEntity = { ...entity };
        newEntity.prevChange = change;
        const grid2 = utils.changeEntity(grid1, newEntity, newPosition);
        this.props.actions.updateEntities(grid2);
        // utils.renderViewport(this.props.appState.heroPosition,
        // this.props.appState.entities, this.props.appState.cellSize);
      }
      // handle collisions
      if (destination.type === 'hero') {
        this.props.actions.setCurrentEntity(entity);
        document.getElementById('entity').classList.remove('spin');
        this.handleCombat(entity, newPosition);
      }
    }
    if (this.props.appState.running && entity.combat) {
      this.handleCombat(entity, coords);
    }
  }

  step() {
    if (this.props.appState.running) {
      const currentEntities = this.props.appState.entities;
      const heroPosition = this.props.appState.heroPosition;
      const doors = this.props.appState.doors;
      currentEntities.map((row, rIdx) => {
        row.map((cell, cIdx) => {
          // only calculate movement for monsters inside current viewport
          if (cell.type === 'monster' && utils.inViewport([cIdx, rIdx], heroPosition)) {
            console.log(`${cell.name} is in viewport at ${cIdx} across, ${rIdx} down`);
            console.log(`${cell.name} prevMoveChange = ${cell.prevChange}`);
            // choose next move in monsterAI algorithm
            const heroRoom = this.props.appState.hero.room;
            const newMonsterPosition = utils.monsterAI(currentEntities,
              [cIdx, rIdx], heroPosition, doors, heroRoom, cell.prevChange);
            console.log(`newMonsterPos: ${newMonsterPosition}, ${typeof newMonsterPosition}`);
            // calculate change
            if (newMonsterPosition) {
              console.log(`cIdx: ${cIdx}, ${typeof cIdx}. rIdx: ${rIdx}, ${typeof rIdx}.`);
              console.log(`newMonsterPosition[0]: ${newMonsterPosition[0]}, ${typeof newMonsterPosition[0]}. newMonsterPosition[1]: ${newMonsterPosition[1]}, ${typeof newMonsterPosition[1]}.`);
              const change = [newMonsterPosition[0] - cIdx, newMonsterPosition[1] - rIdx];
              console.log(`change: ${change}`);
              // move monster to new position and re-render viewport
              this.monsterMovement(currentEntities, cell, [cIdx, rIdx], change);
            }
          }
          return null;
        });
        return null;
      });
    }
  }

  play() {
    this.props.actions.play();
    this.run();
  }

  run() {
    console.log('running');
    const self = this;
    function nextStep() {
      // console.log('nextStep');
      if (!self.props.appState.running) {
        console.log('clearInterval');
        window.clearInterval(window.interval);
        return;
      }
      self.step();
    }
    console.log('setInterval');
    window.interval = window.setInterval(nextStep, 1000);
  }

  pause() {
    console.log('paused');
    window.clearInterval(window.interval);
    this.props.actions.pause();
  }

  startGame() {
    const { newMap, heroPosition, trumpPosition, doors } =
      fillGrid(generateMap(1), 1, this.props.appState.hero);
    this.props.actions.start(newMap, heroPosition, trumpPosition, doors);
    this.play();
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
        {this.props.appState.bigMsg.show &&
          <BigMsg
            handleKeydown={this.handleKeydown}
          />
        }
        {!this.props.appState.bigMsg.show &&
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
        }
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
