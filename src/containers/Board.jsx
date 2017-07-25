import React, { Component } from 'react';
import shortid from 'shortid';

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
      hero: {
        hp: 100,
        xp: 0,
        attack: 10,
      },
      messages: [],
    };

    this.handleKeydown = this.handleKeydown.bind(this);
    this.userInput = this.userInput.bind(this);
  }
  componentWillMount() {

  }

  componentDidMount() {
    this.startGame();
    window.addEventListener('keydown', this.handleKeydown);
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if(this.state.entities !== prevState.entities){
  //     this.renderCanvas(this.state.entities, prevState.entities, false);
  //         }
  // }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  setLevel(level) {
    this.setState({
      gameLevel: level,
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
    const [x, y] = this.state.heroPosition;
    const [changeX, changeY] = change;
    const newPosition = [changeX + x, changeY + y];
    const newHero = this.state.entities[y][x];
    const destination = this.state.entities[y + changeY][x + changeX];
    // console.log('moving', x,y, destination);
    if (destination.type !== 'wall' && destination.type !== 'monster' && destination.type !== 'boss') {
      const grid1 = utils.changeEntity(this.state.entities, { type: 'floor' }, [x, y]);
      const grid2 = utils.changeEntity(grid1, newHero, newPosition);
      this.setState({
        ...this.state,
        entities: grid2,
        heroPosition: newPosition,
      }, () => {
        utils.renderViewport(this.state.heroPosition, this.state.entities, false);
      });
    }
    // handle collisions
    switch (destination.type) {
      case 'finalMonster':
      case 'monster':
        this.handleCombat(destination, newPosition, newHero);
        break;
      case 'food':
        this.modifyHP(destination);
        break;
      case 'animal':
        this.addAnimal(destination);
        break;
      case 'staircase':
        this.handleStaircase(destination);
        break;
      default:
    }
  }

  addAnimal(animal) {
    const hero = Object.assign({}, this.state.hero);
    const messages = [...this.state.messages];
    hero.attack += animal.damage;
    messages.push(`You added ${animal.name} to your team! ${animal.message}, and adds ${animal.damage} points of damage to your team attack.`);
    this.setState({
      hero,
      messages,
    }, () => {
      // console.log(hero);
    });
  }

  modifyXP(delta) {
    const hero = Object.assign({}, this.state.hero);
    hero.xp += delta;
    this.setState({
      hero,
    }, () => {
      // console.log(hero);
    });
  }

  modifyHP(entity, delta) {
    const hero = Object.assign({}, this.state.hero);
    const messages = [...this.state.messages];
    if (entity.type === 'food') {
      const healthBoost = entity.healthBoost;
      hero.hp += healthBoost;
      messages.push(`You ate ${entity.name} and gained ${entity.healthBoost} health points!`);
    } else {
      hero.hp += delta;
      if (hero.hp < 0) {
        hero.hp = 0;
      }
    }
    this.setState({
      hero,
      messages,
    }, () => {
      // console.log(hero);
    });
  }

  restart() {
    this.setState({
      entities: [[]],
      gameLevel: 1,
      heroPosition: [],
      hero: {
        hp: 100,
        xp: 0,
        attack: 10,
      },
      messages: [],
    }, () => this.startGame(),
    );
  }

  handleCombat(monster, newPosition, newHero) {
    const hero = Object.assign({}, this.state.hero);
    const messages = [...this.state.messages];
    const currMonster = monster;
    messages.push(`Your team is attacking ${monster.name}!`);
    const heroLevel = Math.floor(hero.xp / 100) + 1;
    // hero attacks monster
    const monsterDamageTaken = Math.floor(hero.attack * utils.random(1, 1.3) * heroLevel);
    currMonster.health -= monsterDamageTaken;
    if (currMonster.health > 0) {
      // monster attacks hero
      const heroDamageTaken = Math.floor(utils.random(0.7, 1.3) * currMonster.damage);
      utils.changeEntity(this.state.entities, monster, newPosition);
      this.modifyHP(currMonster, 0 - heroDamageTaken);
      // put this in combat card view
      messages.push(`Your team attacked ${currMonster.name} and did [${monsterDamageTaken}] damage.
      ${currMonster.name} hits back with [${heroDamageTaken}] damage.
      ${currMonster.name} HP remaining: [${currMonster.health}].`);
      if (hero.health - heroDamageTaken <= 0) {
        // you died!
        setTimeout(() => this.setLevel('death'), 250);
        setTimeout(() => messages.push(`You died! ${currMonster.youDiedMsg}.`), 1000);
        setTimeout(() => {
          this.restart();
        }, 3000);
        return;
      }
    } else if (currMonster.health <= 0) {
      // monster dies, add XP & move hero
      const [x, y] = this.state.heroPosition;
      this.modifyXP(10);
      const grid1 = utils.changeEntity(this.state.entities, { type: 'floor' }, [x, y]);
      const grid2 = utils.changeEntity(grid1, newHero, newPosition);
      this.setState({
        entities: grid2,
        heroPosition: newPosition,
      }, () => {
        utils.renderViewport(this.state.heroPosition, this.state.entities, false);
      });
      if (monster.type === 'finalMonster') {
        messages.push(`You did it! Your attack of [${monsterDamageTaken}] defeated ${currMonster.name}.`); // fix this msg later
        setTimeout(() => this.setLevel('victory'), 250);
        setTimeout(() => messages.push('You won! blah blah blah.'), 1000); // fix this msg later
        setTimeout(() => {
          this.restart();
        }, 3000);
        return;
      }
      messages.push(`You did it! Your attack of [${monsterDamageTaken}] defeated ${currMonster.name}.`); // fix this msg later
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
          utils.renderViewport(this.state.heroPosition, this.state.entities, true);
        }, 1000);
      });
    });
  }

  startGame() {
    const { newMap, heroPosition } = fillGrid(generateMap(1), 1);
    this.setState({
      entities: newMap,
      heroPosition,
    }, () => {
      utils.renderViewport(this.state.heroPosition, this.state.entities, false);
    });
  }

  render() {
    const messages = this.state.messages;
    const messageList = messages.slice(messages.length - 3, messages.length).map(message => (
      <li key={shortid.generate()}>
        {message}
      </li>));
// return only 3 most recent message, style
    return (
      <div className="container">
        <div className="message">
          <ul>
            {messageList.reverse()}
          </ul>
        </div>
        <canvas
          id="board"
          className="board clip-circle"
          width={utils.vWidth * utils.cellSize}
          height={utils.vHeight * utils.cellSize}
        />
      </div>
    );
  }
}

export default Board;
