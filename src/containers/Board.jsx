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
import generateMap from '../utils/mapGen';
import fillGrid from '../utils/fillGrid';

const updateXP = (xp) => {
  const width = xp / 3;
  document.styleSheets[0].addRule('.hero__xp-slider::after', `width: ${width}% !important`);
};

class Board extends Component {

  constructor(props) {
    super(props);

    this.handleKeydown = this.handleKeydown.bind(this);
    this.userInput = this.userInput.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
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
        this.props.appState.entities);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    this.props.actions.updateDimensions(window.innerWidth, window.innerHeight);
    utils.renderViewport(this.props.appState.heroPosition,
      this.props.appState.entities);
  }

  handleKeydown(e) {
    switch (e.keyCode) {
      case 38:
      case 87:
        e.preventDefault();
        this.userInput([0, -1]);
        break;
      case 39:
      case 68:
        e.preventDefault();
        this.userInput([1, 0]);
        break;
      case 40:
      case 83:
        e.preventDefault();
        this.userInput([0, 1]);
        break;
      case 37:
      case 65:
        e.preventDefault();
        this.userInput([-1, 0]);
        break;
      default:
    }
  }

  userInput(change) {
    const [x, y] = this.props.appState.heroPosition;
    const [changeX, changeY] = change;
    const newPosition = [changeX + x, changeY + y];
    const newHero = this.props.appState.entities[y][x];
    const destination = this.props.appState.entities[y + changeY][x + changeX];
    if (destination.type !== 'wall' && destination.type !== 'monster' && destination.type !== 'finalMonster') {
      const grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor' }, [x, y]);
      const grid2 = utils.changeEntity(grid1, newHero, newPosition);
      this.props.actions.userInput(grid2, newPosition);
    }
    // handle collisions
    switch (destination.type) {
      case 'finalMonster':
      case 'monster':
        this.props.actions.setCurrentEntity(destination);
        document.getElementById('entity').classList.remove('spin');
        this.handleCombat(destination, newPosition, newHero);
        break;
      case 'food':
        this.props.actions.setCurrentEntity(destination);
        document.getElementById('entity').classList.remove('spin');
        this.healthBoost(destination);
        break;
      case 'teamHero':
        this.props.actions.setCurrentEntity(destination);
        document.getElementById('entity').classList.remove('spin');
        this.addTeamHero(destination);
        break;
      case 'staircase':
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

  handleCombat(monster, newPosition, newHero) {
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

    this.props.actions.setCurrentEntity(monster);

    // save message to display later in info panel
    messages.push(`Your team is attacking ${monster.name}!`);

    // check hero level
    const heroLevel = Math.floor(hero.xp / 100) + 1;

    // HERO ATTACK //
    const monsterDamageTaken = Math.floor(hero.attack *
      utils.random(1, 1.3) * (((heroLevel - 1) * 0.5) + 1));
    const currentEntity = monster;
    currentEntity.health -= monsterDamageTaken;

    // monster can't have negative health
    if (currentEntity.health < 0) {
      currentEntity.health = 0;
    }

    // update monster health in app state after attack
    const entities = this.props.appState.entities;
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

      // save and then display newest messages
      messages.push(`Your team attacked ${currentEntity.name}. He lost ${monsterDamageTaken} HP.
      ${currentEntity.name} hit back. You lost ${heroDamageTaken} HP.`);
      this.props.actions.updateMessages(messages);

      // HANDLE HERO DEATH //
      if (hero.hp - heroDamageTaken <= 0) {
        const youDiedMsg = `${utils.badNews[Math.floor(utils.random(0, 13))]}! You were defeated by ${currentEntity.name} — ${currentEntity.bio}`;
        this.props.actions.showMsg({
          title: 'You died!',
          imgUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/you-died.png',
          imgAlt: 'skull and crossbones',
          body: youDiedMsg,
          action,
          actionText: 'Play Again',
        });
        document.getElementById('hero').classList.add('spin');
        setTimeout(() => {
          messages.push(`You died! ${currentEntity.youDiedMsg}.`);
          this.props.actions.updateMessages(messages);
        }, 1000);
        return;
      }

       // HANDLE MONSTER DEATH //
    } else if (currentEntity.health <= 0) {
      document.getElementById('entity').classList.add('spin');
      setTimeout(() => {
        document.getElementById('entity').classList.remove('spin');
      }, 1000);
      const [x, y] = this.props.appState.heroPosition;
      hero.xp += 25;
      updateXP(hero.xp);
      hero.level = Math.floor(hero.xp / 100) + 1;
      if (hero.xp % 100 === 0) {
        document.getElementById('hero').classList.add('powerUp');
        document.getElementById('hero-level').classList.add('powerUp');
        messages.push(`Level UP!! Your team is now prepared to take on level ${hero.level} monsters.`);
        this.props.actions.updateMessages(messages);
        setTimeout(() => {
          document.getElementById('hero').classList.remove('powerUp');
          document.getElementById('hero-level').classList.remove('powerUp');
        }, 2000);
      }

      const grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor' }, [x, y]);
      const grid2 = utils.changeEntity(grid1, newHero, newPosition);
      this.props.actions.updateGrid(grid2, newPosition);
      utils.renderViewport(this.props.appState.heroPosition,
        this.props.appState.entities);

      this.props.actions.updateHero(hero);
      this.props.actions.updateMessages(messages);
      this.props.actions.setCurrentEntity(currentEntity);

       // HANDLE GAME WIN  //
      if (monster.type === 'finalMonster') {
        const youWonMsg = `${utils.goodNews[Math.floor(utils.random(0, 13))]}! You and your team defeated the biggest monster of all! Great work!`;
        messages.push(`You did it! Your attack of [${monsterDamageTaken}] defeated ${currentEntity.name}.`); // fix this msg later
        setTimeout(() => messages.push('You won! blah blah blah.'), 1000); // fix this msg later
        this.props.actions.showMsg({
          title: 'You won!',
          imgUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/rainbow.png',
          imgAlt: 'rainbow',
          body: youWonMsg,
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
    const { newMap, heroPosition, trumpPosition } = fillGrid(generateMap(level + 1),
      level + 1, this.props.appState.hero);
    this.props.actions.handleStaircase(currentEntity,
      heroPosition, trumpPosition, newMap, level + 1);
    document.getElementById('subhead').classList.add('powerUp');
    setTimeout(() => {
      utils.renderViewport(this.props.appState.heroPosition,
        this.props.appState.entities);
    }, 1000);
    setTimeout(() => {
      document.getElementById('board').classList.remove('staircaseSpin');
      document.getElementById('subhead').classList.remove('powerUp');
    }, 2000);
  }

  startGame() {
    const { newMap, heroPosition, trumpPosition } =
      fillGrid(generateMap(1), 1, this.props.appState.hero);
    this.props.actions.start(newMap, heroPosition, trumpPosition);
  }

  render() {
    const clipRadius = this.props.appState.clipSize / 2;
    const cellSize = 32;
    const messages = [...this.props.appState.messages];
    const messageList = messages.map(message => (
      <li key={shortid.generate()} className="message__item">
        {message}
      </li>));
    let colWidth;
    if (document.getElementById('colWide')) {
      colWidth = document.getElementById('colWide').clientWidth;
    }
    const canvasStyle = {
      clipPath: `circle(${clipRadius}px at center)`,
    };
    if (colWidth < 660) {
      canvasStyle.marginLeft = `${(colWidth / 2) - 320}px`;
      canvasStyle.marginTop = `${(colWidth / 2) - 320}px`;
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
                        this.props.actions.restart();
                        this.props.history.push('/');
                      }}
                    aria-label="restart game"
                  >
                    <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/refresh.svg" alt="" />
                  </button>
                  <button
                    className="aria-button info__icon"
                    onClick={
                      () => {
                        this.props.actions.toggleSound(this.props.appState.sound);
                      }}
                    aria-label="toggle sound"
                  >
                    <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/volume-up.svg" alt="" />
                  </button>
                  <button
                    className="aria-button info__icon"
                    onClick={
                      () => {
                        this.props.actions.toggleTorch(this.props.appState.torch);
                      }}
                    aria-label="toggle torch"
                  >
                    <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/flashlight.svg" alt="" />
                  </button>
                  <a
                    className="aria-button info__icon"
                    href="https://github.com/rifkegribenes/dungeon-crawler"
                    rel="noopener noreferrer"
                    target="_blank"
                    title="github"
                  >
                    <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/github.svg" alt="" />
                  </a>
                </div>
              </div>
              <canvas
                id="board"
                className="board"
                width={utils.vWidth * cellSize}
                height={utils.vHeight * cellSize}
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
