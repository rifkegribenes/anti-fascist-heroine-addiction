import React, {Component} from 'react';
import * as utils from '../utils/mapgen';

class Board extends Component {
  constructor() {
    super();
    this.state = {}
  }
  componentDidMount() {
  	utils.generateMap();
  }
  render() {
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
