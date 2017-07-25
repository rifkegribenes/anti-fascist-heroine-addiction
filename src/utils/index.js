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
const drawCell = (ctx, x, y, vX, vY, torch, firstRender, cellType, opacity, iconUrl) => {
  const hue = ((x + y) / 10) % 360;
  const img = new Image();
  if (torch === 0) {
    console.log(cellType, torch);
    ctx.clearRect(x, y, cellSize, cellSize);
  } else
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
        ctx.fillStyle = 'hsla(0, 0%, 80%, 1)';
        ctx.fillRect(x, y, cellSize, cellSize);
        break;
      case 'hero':
        ctx.fillStyle = 'hsla(60, 100%, 50%, 1)';
        ctx.fillRect(x, y, cellSize, cellSize);
        break;
      case 'monster':
        ctx.fillStyle = 'hsla(360, 100%, 50%, 1)';
        ctx.fillRect(x, y, cellSize, cellSize);
        break;
      case 'food':
        ctx.fillStyle = 'hsla(120, 100%, 50%, 1)';
        ctx.fillRect(x, y, cellSize, cellSize);
        break;
      case 'animal':
        ctx.fillStyle = 'hsla(0, 0%, 80%, 1)';
        ctx.fillRect(x, y, cellSize, cellSize);
        img.src = iconUrl;
        img.onload = () => {
          ctx.save();
          ctx.globalAlpha = torch;
          ctx.drawImage(img, x, y, cellSize, cellSize);
          ctx.restore();
        };
        if (!iconUrl) {
          ctx.fillStyle = 'hsla(180, 100%, 50%, 1)';
          ctx.fillRect(x, y, cellSize, cellSize);
        }
        break;
      case 'boss':
        ctx.fillStyle = 'hsla(30, 100%, 50%, 1)';
        ctx.fillRect(x, y, cellSize, cellSize);
        break;
      case 'staircase':
        ctx.clearRect(x, y, cellSize, cellSize);
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, cellSize, cellSize);
        break;
      default:
        ctx.fillStyle = 'hsla(270, 100%, 50%, 1)';
        ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
};

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const renderViewport = (heroPosition, entities, torch, firstRender) => {
// add oldGrid param and 'diff' grids before render
  const [hX, hY] = heroPosition;
  const newEntities = entities.map(row => row.map((cell) => {
    const newCell = Object.assign({}, cell);
    return newCell;
  }));
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);// reset the transform matrix as it is cumulative
  ctx.clearRect(0, 0, vWidth * cellSize, vHeight * cellSize);
  // clear the viewport AFTER the matrix is reset
    // Clamp viewport position to grid bounds & center around hero
  const vX = clamp(((hX - (vWidth / 2))), 0, ((gridWidth - vWidth)));
  const vY = clamp(((hY - (vHeight / 2))), 0, ((gridHeight - vHeight)));
    // filter out rows above or below viewport
  newEntities.filter((row, rIdx) => rIdx >= vY && rIdx < (vY + vHeight)).map((r, i) =>
      // filter out cells to the left or right of  viewport in each row
       r.filter((r2, i2) => i2 >= vX && i2 < (vX + vWidth))
      .map((c, j) => {
        const x = cellSize * j;
        const y = cellSize * i;
        const newCell = Object.assign({}, c);
        // draw each cell that's inside the torch radius
        // if ( (Math.sqrt((j - hX) ** 2) + ((i - hY) ** 2)) < 10 )
        //   {
        drawCell(
            ctx, x, y, vX, vY, torch, firstRender, newCell.type, newCell.opacity, newCell.iconUrl,
            );
        return null;
      // } else {
      //   return null;
      // }
      }));
};

export const updateCells = (newArr, oldArr, firstRender) => {
  newArr.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      const x = cellSize * cellIdx;
      const y = cellSize * rowIdx;
      const newCell = Object.assign({}, cell);
      if (newCell !== oldArr[rowIdx][cellIdx] && newCell.type !== 'wall') {
// change the hard coded 1 in 4th arg to cell.torch
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

