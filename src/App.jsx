import React from 'react';

import * as utils from './utils/index';

// import Splash from './containers/Splash';
// import Controls from './containers/Controls';
// import Message from './containers/Message';
// import Info from './containers/Info';
import Board from './containers/Board';

const App = () => (
  <main>
    <div className="container">
      {/* <Splash />
      <Controls />
      <Message />
      <Info /> */}
      <canvas
        id="board"
        className="board"
          // onClick={e => this.handleClick(e)}
        width={utils.gridWidth * utils.cellSize}
        height={utils.gridHeight * utils.cellSize}
      />
      <Board />
    </div>
  </main>
  );

export default App;
