import React, {Component} from 'react';
import * as utils from '../utils';
import generateMap from '../utils/mapGen';
import fillGrid from '../utils/fillGrid';
import * as loadImages from '../utils/loadImages';
import toggleTorch from '../utils/fillGrid';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: [[]],
      gameLevel: 0,
      heroPosition: []
    }

    this.handleKeydown = this.handleKeydown.bind(this);
    this.playerInput = this.playerInput.bind(this);
  }
  componentDidMount() {
  	loadImages.load([
    // '../img/baby-fox.gif',
    // '../img/baby-hippo.gif'
]);
    loadImages.onReady(this.startGame);
  	const { gameMap, heroPosition } = fillGrid(generateMap());
    this.setState({
      entities: gameMap,
      heroPosition,
    }, () => {
      console.log('CDM', this.state.entities);
    });
    window.addEventListener('keydown', this.handleKeydown);
  }


  startGame() {
  	console.log('images loaded.');
  }

  componentWillUnmount() {
 window.removeEventListener('keydown', this.handleKeydown);
 }

  handleKeydown(e) {
    switch (e.keyCode) {
      case 38:
      case 87:
        this.playerInput([0, -1]);
        break;
      case 39:
      case 68:
        this.playerInput([1, 0]);
        break;
      case 40:
      case 83:
        this.playerInput([0, 1]);
        break;
      case 37:
      case 65:
        this.playerInput([-1, 0]);
        break;
      default:
        return;
  }
  }

  playerInput(change) {
    const [ x, y ] = this.state.heroPosition;
    const [ changeX, changeY ] = change;
    const newPosition = [changeX + x, changeY + y];
    const newHero = this.state.entities[y][x];
    const destination = this.state.entities[y + changeY][x + changeX];
    console.log( 'moving', newHero, destination);
    this.changeEntity({ type: 'floor' }, [x, y]);
    this.changeEntity(newHero, newPosition);
    this.changeHeroPosition(newPosition);
  };

  changeEntity(entity, coords) {
      const [x, y] = coords;
      console.log(x,y);
      console.log(this.state.entities);
      const entities = this.state.entities.map((row, idx) => {
        if (idx === y) {
        let newRow = row.slice();
        newRow[x] = entity;
        return newRow;
        } else {
          return row;
        }
      });
      utils.updateCells(entities, this.state.entities);
      this.setState({
        entities,
      }, () => {
        console.log(this.state.entities[y][x]);
      });
  }

  changeHeroPosition(heroPosition) {
      this.setState({
        heroPosition,
      });
    }

  createLevel(level) {
    const {gameMap, heroPosition} = fillGrid(generateMap(), level);
      this.setState({
        heroPosition,
        entities: gameMap,
      });
    }

  setLevel(level) {
    this.setState({
      gameLevel: level
    });
  }

  render() {
  	// let { entities,playerPosition } = this.props.entities;
   //  const [ playerX, playerY ] = playerPosition;


    return (
  <div>
    <button onClick={e => {toggleTorch}} />
    <canvas
          id="board"
          className="board"
          // onClick={e => this.handleClick(e)}
          width={utils.gridWidth * utils.cellSize}
          height={utils.gridHeight * utils.cellSize}
        />
  </div>
);
  }
}

export default Board;
