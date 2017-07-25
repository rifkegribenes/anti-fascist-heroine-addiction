// global constants
export const cellSize = 32;
export const gridHeight = 60;
export const gridWidth = 80;
export const vHeight = 20;
export const vWidth = 20;

// helper functions
export const random = (min, max) => (Math.random() * (max - min)) + min;
export const randomInt = (min, max) => Math.floor(random(min, max));

// render to canvas
const drawCell = (ctx, x, y, vX, vY, firstRender, cellType, opacity, iconUrl) => {
  const hue = ((x + y) / 10) % 360;
  const img = new Image();
  // if (torch === 0) {
  //   // console.log(cellType, torch);
  //   ctx.translate( vX, vY );
  //   ctx.clearRect(x, y, cellSize, cellSize);
  // } else
  if (firstRender && cellType === 'wall') {
    ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${opacity})`;
    ctx.fillRect(x, y, cellSize, cellSize);
  } else {
    switch (cellType) {
      case 'wall':
        ctx.clearRect(x, y, cellSize, cellSize);
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${opacity})`;
        ctx.fillRect(x, y, cellSize, cellSize);
        break;
      case 'floor':
        ctx.fillStyle = `hsla(0, 0%, 80%, 1)`;
        ctx.fillRect(x, y, cellSize, cellSize);
        break;
      case 'hero':
        ctx.fillStyle = `hsla(60, 100%, 50%, 1)`;
        ctx.fillRect(x, y, cellSize, cellSize);
        break;
      case 'monster':
        ctx.fillStyle = `hsla(360, 100%, 50%, 1)`;
        ctx.fillRect(x, y, cellSize, cellSize);
        break;
      case 'food':
        ctx.fillStyle = `hsla(120, 100%, 50%, 1)`;
        ctx.fillRect(x, y, cellSize, cellSize);
        break;
      case 'animal':
        ctx.fillStyle = `hsla(0, 0%, 80%, 1)`;
        ctx.fillRect(x, y, cellSize, cellSize);
        img.src = iconUrl;
        img.onload = () => {
          ctx.save();
          // ctx.globalAlpha = torch;
          ctx.drawImage(img, x, y, cellSize, cellSize);
          ctx.restore();
        };
        if (!iconUrl) {
          ctx.fillStyle = 'blue';
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      // else {
      // ctx.strokeStyle="green";
      // ctx.rect(x, y, cellSize, cellSize);
      // ctx.stroke();
      // }
        break;
      case 'boss':
        ctx.fillStyle = `hsla(30, 100%, 50%, 1)`;
        ctx.fillRect(x, y, cellSize, cellSize);
        break;
      case 'staircase':
        ctx.clearRect(x, y, cellSize, cellSize);
        ctx.fillStyle = `hsla(0, 0, 40%, 1)`;
        ctx.fillRect(x, y, cellSize, cellSize);
        break;
      default:
        ctx.fillStyle = `hsla(270, 100%, 50%, 1)`;
        ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
};

export const renderViewport = (heroPosition, entities, firstRender) => { //add oldGrid param and 'diff' grids before render
// add torch param back in after testing
    const [ hX, hY ] = heroPosition;
    console.log(hX, hY);
    const newEntities = entities.map((row, i) => row.map((cell, j) => {
      const newCell = Object.assign({}, cell);
      newCell.distance = (Math.abs(hY - i)) + (Math.abs(hX - j));
      return newCell;
    }));
    // define the limits of the cells to be displwayed in the viewport
    const top = clamp((hY - vHeight) / 2, 0, gridHeight - vHeight);
    const right = Math.max((hX + vWidth) / 2, vWidth);
    const bottom = Math.max((hY + vHeight) / 2, vHeight);
    const left = clamp((hX - vWidth) / 2, 0, gridWidth - vWidth);
    console.log(`top: ${top},right: ${right}, bottom: ${bottom}, left: ${left}`);

    const canvas = document.getElementById('board');
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1,0,0,1,0,0);//reset the transform matrix as it is cumulative
    ctx.clearRect(0, 0, vWidth*cellSize, vHeight*cellSize);//clear the viewport AFTER the matrix is reset
    //Clamp viewport position to grid bounds & center around hero
    // initial hero position: x=40,y=30 = 1280px,960px
    // initial clamp formula for vX = val: 1280-320, min: 0, max: 2560-640 (960, 0, 1920)
    // initial clamp formula for vY = val: 960-320, min: 0, max: 1920-640 (640, 0, 1280)
    // let vX = clamp(((hX - (vWidth / 2)) * cellSize), 0, ((gridWidth - vWidth) * cellSize));
    // let vY = clamp(((hY - (vHeight / 2)) * cellSize), 0, ((gridHeight - vHeight) * cellSize));
    let vX = clamp(((hX - (vWidth / 2))), 0, ((gridWidth - vWidth)));
    let vY = clamp(((hY - (vHeight / 2))), 0, ((gridHeight - vHeight)));
    console.log( `clamp: ${vX}, ${vY}` ); // initial clamp should be 960, 640

    // filter out rows above or below viewport, then map those rows
    const filteredEntities = newEntities.filter((row, i) => i >= vY && i < (vY+vHeight)).map((row, i) => {
      // filter out cells that are to the left or right of the viewport in each row, then map those cells
      return row.filter((row, i) => i >= vX && i < (vX + vWidth))
      .map((cell, j) => {
        const x = cellSize * j;
        const y = cellSize * i;
        let newCell = Object.assign({},cell);
        // if (newCell.type = 'hero') {console.log(`hero is at ${j},${i}`);}
        // if (!newCell.opacity) { newCell.opacity = '1'; }
        // draw each cell in the row
        drawCell(ctx, x, y, vX, vY, firstRender, newCell.type, newCell.opacity, newCell.iconUrl);
        // if (newCell.type !== 'wall') {console.log(newCell, j, i);} //these are the entities that should show up in viewport
      })
    });
    // console.log('after filtering for viewport width & height, filteredEntities =');
    // console.log(filteredEntities.map((row, i) => { return row.map((cell, j) => { let newCell = Object.assign({}, cell); console.log(newCell, newCell.type, j, i);})}));
  }



// export const draw = (heroPosition, entities, firstRender) => {
//   const canvas = document.getElementById('board');
//   const ctx = canvas.getContext('2d');
//   let [x,y] = heroPosition;
//   console.log(x,y);
//   ctx.setTransform(1,0,0,1,0,0);//reset the transform matrix as it is cumulative
//   ctx.clearRect(0, 0, vWidth*cellSize, vHeight*cellSize);//clear the viewport AFTER the matrix is reset
//   //Clamp the camera position to the world bounds while centering the camera around the player
//   // let camX = clamp(((vWidth * cellSize) / 2) - (x * cellSize), 0, (gridWidth * cellSize) - (vWidth * cellSize));
//   let camX = clamp(320-1280, 0, 2240);
//   // let camY = clamp(((vHeight * cellSize) / 2) - (y * cellSize), 0, (gridHeight * cellSize) - (vHeight * cellSize));
//   let camY = clamp(320-960, 0, 1280);
//   console.log(camX, camY);
//   ctx.translate( camX, camY );
//   drawCells(entities, firstRender);
// }

const clamp = (val, min, max) => {
    return Math.min(Math.max(val, min), max);
}

// export const drawCells = (arr, firstRender) => {
//   arr.forEach((row, rowIdx) => {
//     row.forEach((cell, cellIdx) => {
//       const x = cellSize * cellIdx;
//       const y = cellSize * rowIdx;
//       const newCell = cell;
//       if (!newCell.opacity) { newCell.opacity = '1'; }
// // change the hard coded 1 in 4th arg to cell.torch
//       drawCell(x, y, firstRender, newCell.type, newCell.torch, newCell.opacity, newCell.iconUrl);
//     });
//   });
// };

export const updateCells = (newArr, oldArr, firstRender) => {
  newArr.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      const x = cellSize * cellIdx;
      const y = cellSize * rowIdx;
      const newCell = Object.assign({}, cell);
      if (newCell !== oldArr[rowIdx][cellIdx] && newCell.type !== 'wall') {
// change the hard coded 1 in 4th arg to cell.torch
        // console.log(newCell);
        // console.log(newCell.torch);
        if (!newCell.opacity) { newCell.opacity = 1; }
        if (!newCell.torch) { newCell.torch = 1; }
        drawCell(x, y, firstRender, newCell.type, newCell.torch, newCell.opacity, newCell.iconUrl);
      }
    });
  });
};

export const changeEntity = (entities, entity, coords) => {
  const [x, y] = coords;
  return entities.map((row, idx) => {
    if (idx === y) {
      const newRow = row.slice();
      newRow[x] = entity;
      return newRow;
    }
    return row;
  });
};

