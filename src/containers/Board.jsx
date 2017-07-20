import React, {Component} from 'react';
import * as utils from '../utils';
import generateMap from '../utils/mapGen';
import * as loadImages from '../utils/loadImages';
import toggleTorch from '../utils/fillGrid';
// import fox from '../img/baby-fox.gif';
// import hippo from '../img/baby-hippo.gif';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
  	loadImages.load([
    // '../img/baby-fox.gif',
    // '../img/baby-hippo.gif'
]);
loadImages.onReady(this.startGame);
  	generateMap();
  }

  startGame() {
  	console.log('images loaded.');
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
