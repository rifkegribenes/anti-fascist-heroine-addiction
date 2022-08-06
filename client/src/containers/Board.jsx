import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import shortid from 'shortid';
import { useParams } from 'react-router-dom'; 
import requestFrame from 'request-frame';

import * as Actions from '../store/actions';
import InfoLeft from './InfoLeft';
import InfoRight from './InfoRight';
import * as utils from '../utils/index';
import generateMap from '../utils/mapgen';
import fillGrid from '../utils/fillGrid';

let myReq = null;
let lastMonsterMove = 0;

const updateXP = (xp) => {
  const width = xp / 3;
  document.styleSheets[1].addRule('.hero__xp-slider::after', `width: ${width}% !important`);
};

class Board extends Component {

  constructor(props) {
    super(props);

    this.state = {
      intervalID: null,
      speed: 1,
    };

    this.handleKeydown = this.handleKeydown.bind(this);
    this.userInput = this.userInput.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
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
        // console.log('gridFilled, calling play');
        this.props.actions.play();
      }
    }
    if (!prevProps.appState.running) {
      if (this.props.appState.running) {
        // console.log('running state set, starting game');
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
    const cancel = requestFrame('cancel');
    cancel(myReq);
  }

  updateDimensions() {
    // wide column max width = 675 inner width / 735 outer width
    // board space is vh - 100px (header elements plus padding/margin)

    // default size for big-enough screens
    let clipSize = 640;
    let colWide = 640;

    // find width of middle column
    if (document.getElementById('colWide')) {
      colWide = document.getElementById('colWide').clientWidth;
    }

    // if either width or (adjusted) height is smaller than 640
    // set clip size to actual space available
    if (colWide < 640 || window.innerHeight < 740) {
      if ((window.innerHeight - 100) > colWide) {
        clipSize = colWide;
      } else {
        clipSize = Math.min(colWide,
              (window.innerHeight - 100), 640);
      }
    }

    // make sure clipSize and cellSize are integers, avoid rounding errors
    clipSize = (Math.floor(clipSize / 20)) * 20;
    const cellSize = Math.floor(clipSize / 20);
    this.props.actions.updateDimensions(clipSize, cellSize);
    this.draw();
  }

  handleKeydown(e) {
    // disable user input while game is paused
    if (this.props.appState.running || this.props.appState.difficulty === 0) {
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
      if (destination.type === 'floor' && destination.room !== 'door') {
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: oldRoom }, [x, y]);
        grid2 = utils.changeEntity(grid1, newHero, newPosition);
        this.props.actions.updateGrid(grid2, newPosition);
      }

      // ANYTHING => UNOCCUPIED DOORWAY
      // change hero room to door, replace vacated cell with floor
      if (destination.room === 'door' && (destination.type === 'door' || destination.type === 'floor')) {
        newHero.room = 'door';
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: oldRoom }, [x, y]);
        grid2 = utils.changeEntity(grid1, newHero, newPosition);
        this.props.actions.updateGrid(grid2, newPosition);
        this.props.actions.updateHero(newHero);
        return;
      }

      // ANYTHING => MONSTER IN DOORWAY (no other entity can be in door)
      // replace vacated cell with floor, change hero room, handle entity
      if (destination.room === 'door' &&
        destination.type !== 'door' &&
        destination.type !== 'floor') {
        // special case: padlocked door to trump's room on level 3
        if (destination.type === 'padlock') {
          const messages = [...this.props.appState.messages];
          this.props.actions.updateMessages(messages);
          if (!this.props.appState.key) {
            this.props.actions.setCurrentEntity(destination);
            messages.push("The door to Trump's chambers is locked! Find the key to unlock it before trying to enter.");
            this.props.playSound('combat1');
            return;
          }
          // change this to special graphic for unlocked padlock?
          this.props.actions.setCurrentEntity(destination);
          messages.push('You opened the door!');
          this.props.actions.updateMessages(messages);
          this.props.playSound('magicItem');
          newHero.room = 'door';
          grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: oldRoom }, [x, y]);
          grid2 = utils.changeEntity(grid1, newHero, newPosition);
          this.props.actions.updateGrid(grid2, newPosition);
          this.props.actions.updateHero(newHero);
          return;
        }
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
      }

      // DOOR => MONSTER NOT IN DOORWAY
      // replace vacated cell with door, handle combat
      if (oldRoom === 'door' && (destination.type === 'monster' || destination.type === 'finalMonster')) {
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
        document.getElementById('entity').classList.remove('spin');
        switch (destination.type) {
          // if monster, handle combat
          case 'finalMonster':
          case 'monster':
            this.props.actions.setCurrentEntity(destination);
            this.props.actions.updateCombat(destination.name, 'hero');
            this.handleCombat(destination, newPosition, this.props.appState.heroPosition, 'hero');
            break;
          case 'food':
            this.props.actions.setCurrentEntity(destination);
            this.props.playSound('food');
            this.healthBoost(destination);
            break;
          case 'teamHero':
            this.props.actions.setCurrentEntity(destination);
            this.props.playSound('addHero');
            this.addTeamHero(destination);
            break;
          case 'staircase':
            if (this.props.appState.hero.level > this.props.appState.gameLevel
             || this.props.appState.difficulty < 2) {
              this.props.actions.setCurrentEntity(destination);
              this.props.playSound('staircase');
            }
            this.handleStaircase(destination);
            break;
          case 'candle':
            this.props.actions.setCurrentEntity(destination);
            this.props.playSound('magicItem');
            this.handleCandle();
            break;
          case 'key':
            if (this.props.appState.hero.level > this.props.appState.gameLevel
               || this.props.appState.difficulty < 2) {
              this.props.actions.setCurrentEntity(destination);
              this.props.playSound('magicItem');
              this.handleKey();
            }
            break;
          default:
        }
        return;
      }

      // ANYTHING BUT DOOR => MONSTER NOT IN DOORWAY
      // replace vacated cell with floor, handle combat
      if ((destination.type === 'monster' || destination.type === 'finalMonster') && destination.room !== 'door') {
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
        document.getElementById('entity').classList.remove('spin');
        switch (destination.type) {
          case 'food':
            this.props.actions.setCurrentEntity(destination);
            this.props.playSound('food');
            this.healthBoost(destination);
            break;
          case 'teamHero':
            this.props.actions.setCurrentEntity(destination);
            this.props.playSound('addHero');
            this.addTeamHero(destination);
            break;
          case 'staircase':
            if (this.props.appState.hero.level > this.props.appState.gameLevel
             || this.props.appState.difficulty < 2) {
              this.props.actions.setCurrentEntity(destination);
              this.props.playSound('staircase');
            }
            this.handleStaircase(destination);
            break;
          case 'candle':
            this.props.actions.setCurrentEntity(destination);
            this.props.playSound('magicItem');
            this.handleCandle();
            break;
          case 'key':
            if (this.props.appState.hero.level > this.props.appState.gameLevel
             || this.props.appState.difficulty < 2) {
              this.props.actions.setCurrentEntity(destination);
              this.props.playSound('magicItem');
              this.handleKey();
            }
            break;
          default:
        }
      }
    }
  }

  addTeamHero(teamHero) {
    const hero = { ...this.props.appState.hero };
    const messages = [...this.props.appState.messages];
    hero.attack += teamHero.damage;
    hero.team.push(teamHero);
    messages.push(`You added ${teamHero.name} to your team! She adds ${teamHero.damage} points of damage to your team attack.`);
    this.props.actions.updateHero(hero);
    this.props.actions.updateMessages(messages);
    document.getElementById('hero').classList.add('powerUp');
    setTimeout(() => {
      document.getElementById('hero').classList.remove('powerUp');
    }, 1000);
  }

  healthBoost(food) {
    const hero = { ...this.props.appState.hero };
    const messages = [...this.props.appState.messages];
    const healthBoost = food.healthBoost;
    hero.hp += healthBoost;
    messages.push(`You ate ${food.name} and gained ${food.healthBoost} health points!`);
    this.props.actions.updateHero(hero);
    this.props.actions.updateMessages(messages);
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
      console.log(`candle: ${this.props.appState.candle}`);
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
    this.props.actions.setCurrentEntity(monster);
    const [hx, hy] = heroCoords;

    // set monster to combat = true
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
    this.pause().then(() => {
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
          imgUrl: './img/you-died.png?raw=true',
          imgAlt: 'skull and crossbones',
          news: `${utils.badNews[Math.floor(utils.random(0, 13))]}!`,
          body1: `You were defeated by ${monster.name}`,
          body2: monster.bio,
          action,
          actionText: 'Try Again',
        });
        this.props.history.push('/gameover');
      }, 1000);
    });
  }

  heroLevelUp(hero) {
    const { difficulty, gameLevel } = this.props.appState;
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
    if (difficulty > 1) {
      if (gameLevel < 3) {
        messages.push(`Time to look for the staircase down to level ${gameLevel + 1}`);
      } else {
        messages.push('Time to look for the key to Trump\'s chambers');
      }
    }
    this.props.actions.updateMessages(messages);

    // if staircases were hidden before (difficulty levels 2 & 3), add them now
    if (difficulty > 1 && gameLevel < 3) {
      this.addStaircase();
    }

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

    // update xp slider
    const newHero = { ...hero };
    newHero.xp += 25;
    console.log(`newHero.xp: ${newHero.xp}`);
    updateXP(newHero.xp);
    this.props.actions.updateHero(newHero);
    console.log(newHero);

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
        imgUrl: './img/rainbow.png?raw=true',
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
      cardUrl: './img/staircase_200.png?raw=true',
      message: `Staircase down to level ${this.props.appState.gameLevel + 1}` };
    this.props.actions.setCurrentEntity(currentEntity);
    const level = this.props.appState.gameLevel;
    messages.push(`You found the staircase down to level ${this.props.appState.gameLevel + 1}!`);
    this.props.actions.updateMessages(messages);
    const { newMap, heroPosition, trumpPosition, doors,
      finalMonsterRoom } = fillGrid(generateMap(level + 1),
      level + 1, this.props.appState.hero, this.props.appState.difficulty);
    this.props.actions.handleStaircase(currentEntity,
      heroPosition, trumpPosition, newMap, level + 1, doors, finalMonsterRoom);
    document.getElementById('subhead').classList.add('powerUp');
    setTimeout(() => {
      this.draw();
      // for difficulty level = 2, reset monster speed after level up
      if (this.props.appState.difficulty === 2) {
        const newState = { ...this.state };
        newState.speed = 1 / this.props.appState.gameLevel; // 1 sec, 1/2 sec, 1/3 sec
        this.setState({ ...newState });
      }
    }, 1000);
    setTimeout(() => {
      document.getElementById('board').classList.remove('staircaseSpin');
      document.getElementById('subhead').classList.remove('powerUp');
    }, 2000);
  }

  addStaircase() {
    const entities = this.props.appState.entities;
    const staircases = [
      {
        type: 'staircase',
        name: 'staircase',
        cardUrl: './img/staircase_200.png?raw=true',
        message: `Staircase down to level ${this.props.appState.gameLevel + 1}`,
      },
    ];
    while (staircases.length) {
      const x = Math.floor(Math.random() * utils.gridWidth);
      const y = Math.floor(Math.random() * utils.gridHeight);
      if (entities[y][x].type === 'floor') {
        entities[y][x] = staircases.pop();
      }
    }
    this.props.actions.updateEntities(entities);
  }

  // called from this.update()
  monsterMovement(entities, entity, coords, prevChange) {
    if (this.props.appState.combatName === entity.name && this.props.appState.gridFilled) {
      return;
    }
    if (this.props.appState.running && this.props.appState.combatName !== entity.name && entities) {
      // define constants
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
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: oldRoom }, coords);
      }

      // FLOOR => HERO IN DOORWAY
      // replace vacated cell with floor, handle doorway, handle combat
      if (destination.type === 'hero' && destination.room === 'door') {
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
        newEntity.room = 'door';
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'floor', room: oldRoom }, coords);
      }

      // FLOOR => HERO
      // handle combat, replace vacated cell with floor
      if (destination.type === 'hero' && destination.room !== 'door') {
        this.props.actions.updateCombat(newEntity.name, 'monster');
        this.props.actions.setCurrentEntity(newEntity);
        document.getElementById('entity').classList.remove('spin');
        this.handleCombat(newEntity, coords, newPosition, newEntity.name);
        return;
      }

      // DOOR => FLOOR
      // replace vacated cell with door
      if (entity.room === 'door' && destination.type === 'floor') {
        newEntity.room = this.props.appState.entities[changeY + y][changeX + x].room;
        this.props.actions.updateEntity(newEntity, coords);
        grid1 = utils.changeEntity(this.props.appState.entities, { type: 'door', room: 'door' }, coords);
      }

      // DOOR => HERO
      // replace vacated cell with door, handle combat
      if (entity.room === 'door' && destination.type === 'hero') {
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

  gameLoop(timestamp) {
    let delta;
    let monsterMove = false;
    if (this.props.appState.running) {
      if (!timestamp) {
        delta = 0;
      } else {
        delta = (timestamp - lastMonsterMove) / 1000;
        if (delta > this.state.speed) {
          lastMonsterMove = timestamp;
          monsterMove = true; // tell update function to move monsters
        }
      }
      this.update(this.props.appState.entities, this.props.appState.heroPosition, monsterMove);
      this.draw();
      const request = requestFrame('request');
      setTimeout(() => {
        myReq = request((ts) => {
          this.gameLoop(ts);
        });
      }, 1000 / 12);
    } else {
      console.log('not running');
    }
  }

  update(grid2, newPosition, monsterMove) {
    // update position and object values for hero and all entities
    // for time elapsed since last render
    const currentEntities = this.props.appState.entities;
    const heroPosition = this.props.appState.heroPosition;
    const doors = this.props.appState.doors;

    // calculate hero movement
    this.props.actions.updateEntities(currentEntities, newPosition);

    // calculate monster movement  if
    // difficulty > 0
    // doors has populated from fillGrid
    // & monsters are due to move this round
    if (this.props.appState.difficulty > 0 && doors && doors.length && monsterMove) {
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
    console.log('play');
    // set monster speed
    let speed = 1;
    const { gameLevel, difficulty } = this.props.appState;
    if (difficulty === 1) {
      speed = 1; // move once per second
    } else if (difficulty === 2) {
      speed = 1 / gameLevel; // 1 sec, 1/2 sec, 1/3 sec
    } else if (difficulty === 3) {
      speed = 0.3; // < 1/3 sec
    }
    const newState = { ...this.state };
    newState.speed = speed;
    this.setState({ ...newState });

    this.gameLoop();
  }

  pause() {
    return new Promise((resolve) => {
      window.clearInterval(this.state.intervalID);
      window.clearInterval();
      const cancel = requestFrame('cancel');
      cancel(myReq);
      this.props.actions.pause();
      if (!this.props.appState.running) {
        resolve();
      }
    });
  }

  startGame() {
    const { newMap, heroPosition, trumpPosition, doors } =
      fillGrid(generateMap(1), 1, this.props.appState.hero, this.props.appState.difficulty);
    this.props.actions.start(newMap, heroPosition, trumpPosition, doors);
  }

  draw() {
    const { heroPosition, entities, cellSize, candle, key, hero, gameLevel,
      difficulty } = this.props.appState;
    // let prevVP;
    // render current viewport
    // save current viewport as 'prevVP'

    // calculate whether level has been completed
    // to decide whether to render staircase or key
    let levelCompleted = false;
    if (hero.level > gameLevel) {
      levelCompleted = true;
    }
    if (levelCompleted) { console.log('level Completed'); }

    // if window has been resized since last render,
    // prevVP = null (full re-render)
    // if (resize) {
    utils.renderViewport(heroPosition, entities,
     cellSize, candle, key, levelCompleted, difficulty);
    // } else {
    //   // otherwise, use prevVP to decide which cells to render in this round
    //   prevVP = utils.renderViewport(heroPosition, entities, cellSize,
    //   this.props.appState.prevVP, candle, key, levelCompleted, difficulty);
    // }
    // // save prevVP to app state to compare against next viewport
    // // and only draw diff
    // this.props.actions.setPrevVP(prevVP);
  }

  render() {
    const { clipSize, cellSize } = this.props.appState;
    const clipRadius = clipSize / 2;
    const messages = [...this.props.appState.messages];
    const messageList = messages.map(message => (
      <li key={shortid.generate()} className="message__item">
        {message}
      </li>));
    let canvasStyle = {};
    const difficulty = ['practice', 'easy', 'medium', 'hard'];
    canvasStyle = {
      clipPath: `circle(${clipRadius}px at center)`,
      WebkitClipPath: `circle(${clipRadius}px at center)`,
      MozClipPath: `circle(${clipRadius}px at center)`,
    };
    return (
      <div>
        { this.props.appState.modalType === 'pause' &&
          <div className="modal__overlay">
            <div className="modal">
              <button
                id="first"
                className="modal__close aria-button"
                onClick={() => {
                  this.props.playSound('movement');
                  this.props.actions.closeModal();
                }}
              >&times;</button>
              <div className="modal__header">Game paused</div>
              <div className="modal__btn-wrap">
                <button
                  id="last"
                  className="big-msg__btn big-msg__btn--single"
                  onClick={() => {
                    this.props.playSound('movement');
                    this.props.actions.closeModal();
                    this.play();
                  }}
                ><span className="rainbow">Resume</span></button>
              </div>
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
              <span className="info__subhead" id="subhead">Game Level:&nbsp;{this.props.appState.gameLevel}</span>
              <div className="info__icons-wrap">
                {this.props.appState.difficulty > 0 &&
                  <button
                    className="aria-button info__icon"
                    onClick={
                      () => {
                        this.props.playSound('movement');
                        if (this.props.appState.running) {
                          this.props.actions.openModal('pause');
                          this.props.actions.pause();
                          utils.trapFocus();
                        } else {
                          this.play();
                        }
                      }}
                    aria-label="pause"
                    title={this.props.appState.running ? 'pause' : 'resume'}
                  >
                    <span className={this.props.appState.running ?
                      'icon icon-pause ctrl-icon' : 'icon ctrl-icon'}
                    >{!this.props.appState.running && <span>&#9654;</span>}
                    </span>
                  </button> }
                <button
                  className="aria-button info__icon"
                  onClick={
                    () => {
                      this.props.playSound('movement');
                      this.pause().then(() => {
                        console.log('pause resolved, restart');
                        this.props.actions.restart();
                        this.props.history.push('/');
                      });
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
                <a
                  className="aria-button info__icon"
                  href="https://github.com/rifkegribenes/anti-fascist-heroine-addiction"
                  rel="noopener noreferrer"
                  target="_blank"
                  title="github"
                >
                  <i className="icon icon-github ctrl-icon" />
                </a>
              </div>
            </div>
            <div className="info__controls info__controls--bottom">
              <span className="rainbow">Difficulty: {difficulty[this.props.appState.difficulty]}</span>
            </div>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox={`0 0 ${clipSize} ${clipSize}`} xmlSpace="preserve" width={`${clipSize}px`} className="board">
              <defs>
                <circle id="circle" cx={clipRadius} cy={clipRadius} r={clipRadius} />
              </defs>
              <clipPath id="clip">
                <use xlinkHref="#circle" overflow="visible" />
              </clipPath>
              <g clipPath="url(#clip)">
                <foreignObject
                  width={20 * cellSize}
                  height={20 * cellSize}
                >
                  <canvas
                    id="board"
                    className="board"
                    width={20 * cellSize}
                    height={20 * cellSize}
                    style={canvasStyle}
                    clipPath="url(#clip)"
                  />
                </foreignObject>
              </g>
            </svg>
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

export default connect(mapStateToProps, mapDispatchToProps)(Board);
