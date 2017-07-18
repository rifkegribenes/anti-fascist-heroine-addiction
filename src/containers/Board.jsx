import React, {Component} from 'react';
import * as utils from '../utils';
import generateMap from '../utils/mapGen';
import loadImages from '../utils/loadImages';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
  	loadImages.load([
    '../img/sprites.png',
    '../img/terrain.png'
]);
loadImages.onReady(this.startGame);
  	generateMap();
  }

  startGame() {
  	console.log('started game');
  }

  render() {
  	// let { entities,playerPosition } = this.props.entities;
   //  const [ playerX, playerY ] = playerPosition;


    return (
  <div>
    <h2>Board</h2>
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
