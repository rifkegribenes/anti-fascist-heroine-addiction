import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import shortid from 'shortid';
import { withRouter } from 'react-router';

import * as Actions from '../store/actions';
import Info from './Info';
import * as utils from '../utils/index';
import generateMap from '../utils/mapGen';
import fillGrid from '../utils/fillGrid';


class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: [[]],
      gameLevel: 1,
      heroPosition: [],
      hero: this.props.appState.hero,
      messages: [],
      modalOpen: true,
      currentEntity: {},
      width: window.innerWidth,
    };

    this.handleKeydown = this.handleKeydown.bind(this);
    this.userInput = this.userInput.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }
  componentWillMount() {

  }

  componentDidMount() {
    this.startGame();
    window.addEventListener('keydown', this.handleKeydown);
    window.addEventListener('resize', this.updateDimensions);
    document.getElementById('board').focus();
  }

  componentDidUpdate() {
    if (this.props.appState.gridFilled) {
      utils.renderViewport(this.props.appState.heroPosition, this.props.appState.entities, this.state.width);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    this.setState({ width: window.innerWidth }, () => {
      utils.renderViewport(this.props.appState.heroPosition, this.props.appState.entities, this.state.width);
    });
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
    if (destination.type !== 'wall' && destination.type !== 'monster' && destination.type !== 'boss') {
      const grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor' }, [x, y]);
      const grid2 = utils.changeEntity(grid1, newHero, newPosition);
      this.props.actions.userInput(grid2, newPosition);
    }
    // handle collisions
    switch (destination.type) {
      case 'finalMonster':
      case 'monster':
        document.getElementById('entity').classList.remove('spin', 'hidden');
        this.handleCombat(destination, newPosition, newHero);
        break;
      case 'food':
        document.getElementById('entity').classList.remove('spin', 'hidden');
        this.healthBoost(destination);
        break;
      case 'teamHero':
        document.getElementById('entity').classList.remove('spin', 'hidden');
        this.addTeamHero(destination);
        break;
      case 'staircase':
        document.getElementById('entity').classList.remove('spin', 'hidden');
        this.handleStaircase(destination);
        break;
      default:
    }
  }

  addTeamHero(teamHero) {
    const hero = Object.assign({}, this.state.hero);
    const messages = [...this.state.messages];
    const currentEntity = teamHero;
    hero.attack += teamHero.damage;
    hero.team.push(teamHero);
    messages.push(`You added ${teamHero.name} to your team! She adds ${teamHero.damage} points of damage to your team attack.`);
    this.setState({
      hero,
      messages,
      currentEntity,
    }, () => {
      // console.log(hero.team, typeof(hero.team));
    });
  }

  healthBoost(food) {
    const hero = Object.assign({}, this.state.hero);
    const messages = [...this.state.messages];
    const currentEntity = food;
    const healthBoost = food.healthBoost;
    hero.hp += healthBoost;
    messages.push(`You ate ${food.name} and gained ${food.healthBoost} health points!`);
    this.setState({
      hero,
      messages,
      currentEntity,
    }, () => {
      // console.log(hero);
    });
  }

  handleCombat(monster, newPosition, newHero) {
    const hero = Object.assign({}, this.state.hero);
    const messages = [...this.state.messages];
    const currentEntity = monster;
    this.setState({
      currentEntity,
    });
    messages.push(`Your team is attacking ${monster.name}!`);
    const heroLevel = Math.floor(hero.xp / 100) + 1;
    // hero attack
    const monsterDamageTaken = Math.floor(hero.attack *
      utils.random(1, 1.3) * (((heroLevel - 1) * 0.5) + 1));
    currentEntity.health -= monsterDamageTaken;
    this.setState({
      currentEntity,
    });
    if (currentEntity.health < 0) { currentEntity.health = 0; }
    if (currentEntity.health > 0) {
      // monster attack
      const heroDamageTaken = Math.floor(utils.random(0.7, 1.3) * currentEntity.damage);
      utils.changeEntity(this.props.appState.entities, monster, newPosition);
      hero.hp -= heroDamageTaken;
      this.setState({
        hero,
      });
      messages.push(`Your team attacked ${currentEntity.name} and did [${monsterDamageTaken}] damage.
      ${currentEntity.name} hits back with [${heroDamageTaken}] damage.`);
      this.setState({
        messages,
      });
      if (hero.hp - heroDamageTaken <= 0) {
        // you died!
        console.log('you died!');
        document.getElementById('hero').classList.add('spin', 'hidden');
        setTimeout(() => this.props.actions.setLevel(0), 250);
        setTimeout(() => messages.push(`You died! ${currentEntity.youDiedMsg}.`), 1000);
        setTimeout(() => {
          document.getElementById('hero').classList.remove('spin', 'hidden');
          this.props.actions.restart();
          this.props.history.push('/');
        }, 3000);
        return;
      }
    } else if (currentEntity.health <= 0) {
      // monster dies
      document.getElementById('entity').classList.add('spin', 'hidden');
      const [x, y] = this.props.appState.heroPosition;
      hero.xp += 25;
      hero.level = Math.floor(hero.xp / 100) + 1;
      if (hero.xp % 100 === 0) { console.log('level up!'); }
      this.setState({
        hero,
      });
      const grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor' }, [x, y]);
      const grid2 = utils.changeEntity(grid1, newHero, newPosition);
      this.setState({
        entities: grid2,
        heroPosition: newPosition,
      }, () => {
        utils.renderViewport(this.props.appState.heroPosition, this.props.appState.entities, this.state.width);
      });
      if (monster.type === 'finalMonster') {
        messages.push(`You did it! Your attack of [${monsterDamageTaken}] defeated ${currentEntity.name}.`); // fix this msg later
        setTimeout(() => this.props.actions.setLevel(4), 250);
        setTimeout(() => messages.push('You won! blah blah blah.'), 1000); // fix this msg later
        setTimeout(() => {
          this.props.actions.restart();
          this.props.history.push('/');
        }, 3000);
        return;
      }
      messages.push(`You did it! Your attack of [${monsterDamageTaken}] defeated ${currentEntity.name}.`); // fix this msg later
      setTimeout(() => messages.push('You gained 10XP.'), 1000); // fix this msg later
      if ((hero.xp + 10) % 100 === 0) {
        setTimeout(() => messages.push('LEVEL UP!'), 3000);
      }
    }
    this.setState({
      hero,
      messages,
    }, () => {
      // console.log(hero);
    });
  }

  handleStaircase() {
    const messages = this.state.messages;
    const level = this.state.gameLevel;
    messages.push(`You found the staircase down to level ${this.state.gameLevel + 1}!`);
    this.setState({
      messages,
    }, () => {
      const { newMap, heroPosition } = fillGrid(generateMap(level + 1), level + 1);
      this.setState({
        heroPosition,
        entities: newMap,
        gameLevel: level + 1,
      }, () => {
        setTimeout(() => {
          utils.renderViewport(this.props.appState.heroPosition, this.props.appState.entities, this.state.width);
        }, 1000);
      });
    });
  }

  startGame() {
    const { newMap, heroPosition } = fillGrid(generateMap(1), 1, this.props.appState.hero);
    this.props.actions.start(newMap, heroPosition);
  }

  render() {
    const width = this.state.width;
    const cellSize = width > 640 ? 32 : Math.floor(width / 20);
    const clipRadius = cellSize * 10;
    const messages = this.state.messages;
    const messageList = messages.slice(messages.length - 3, messages.length).map(message => (
      <li key={shortid.generate()}>
        {message}
      </li>));
    const canvasStyle = {
      clipPath: `circle(${clipRadius}px at center)`,
    };
// return only 3 most recent message, style
    return (
      <div>
        <div className="container">
          <div className="leftCol">
            <canvas
              id="board"
              className="board"
              width={utils.vWidth * cellSize}
              height={utils.vHeight * cellSize}
              style={canvasStyle}
            />
          </div>
          <div className="rightCol">
            <Info
              hero={this.props.appState.hero}
              entity={this.state.currentEntity}
              gameLevel={this.state.gameLevel}
              header={this.state.header}
            />
            <div className="message">
              <ul>
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
