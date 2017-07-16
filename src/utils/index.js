export const cellSize = 30;
export const gridHeight = 40;
export const gridWidth = 40;
const maxRooms = 15;
const roomSizeRange = [7, 12];
const initialGrid = [];
let currentGrid = [];

// helper functions
const drawCell = (x, y, cellType) => {
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  const opacity = (Math.random() * 0.5) + 0.3;
  switch (cellType) {
    case 'floor':
      ctx.fillStyle = 'black';
      break;
    case 'wall':
      ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
      break;
    default:
      ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
  }
  ctx.fillRect(x, y, cellSize, cellSize);
};

const drawCells = (arr) => {
  arr.forEach((cell, idx) => {
    if (cell !== 0) {
      const x = cellSize * (idx % gridWidth);
      const y = cellSize * (Math.floor(idx / gridWidth));
      const cellType = arr[idx].type;
      drawCell(x, y, cellType);
    }
  });
};

const nextDraw = (nextCells) => {
  const currentBoard = currentGrid;
  const changed = nextCells.map((cell, i) => {
    if (cell.type !== currentBoard[i].type) {
      return cell;
    }
    return 0;
  });
  drawCells(changed);
};

const xyToIdx = (x, y) => {
  const c = Math.floor(x / cellSize);
  const r = Math.floor(y / cellSize);
  return c + (r * gridWidth);
};

const idxToCR = (i) => {
  const c = i % gridWidth;
  const r = Math.floor(i / gridWidth);
  return [c, r];
};

const crToI = (c, r) => c + (r * gridWidth);

// given a columnn and row, adjust for wrapping to other side of board and return index
const crAdjToI = (c, r) => {
  let adjC = c;
  let adjR = r;
  if (c === -1) { adjC = gridWidth - 1; }
  if (r === -1) { adjR = gridHeight - 1; }
  if (c === gridWidth) { adjC = 0; }
  if (r === gridHeight) { adjR = 0; }
  return adjC + (adjR * gridWidth);
};

export const generateMap = () => {
// generate empty grid
  for (let i = 0; i < (gridHeight * gridWidth); i++) {
    initialGrid.push({ type: 'wall' });
  }
  drawCells(initialGrid);
  currentGrid = initialGrid;

// create first room
  const [min, max] = roomSizeRange;
  const firstRoom = {
    x: Math.floor(Math.random() * (gridWidth - max - 1)) + 1,
    y: Math.floor(Math.random() * (gridHeight - max - 1)) + 1,
    height: Math.floor(Math.random() * (max - min)) + min,
    width: Math.floor(Math.random() * (max - min)) + min,
    id: 'O',
  };

// draw first room
  const placeRoom = (oldGrid, { x, y, width = 1, height = 1, id }) => {
    const newGrid = [...oldGrid];
    const startIdx = crToI(x, y);
    console.log(`startIndex = ${startIdx}`);
    for (let i = 0; i < height; i++) {
    // for each room row, starting at first index in row
      for (let j = 0; j < width; j++) { // fill cells in row
        const fillIdx = startIdx + i + (j * gridWidth);
        newGrid[fillIdx] = { type: 'floor', id };
      }
    }
    return newGrid;
  };

  const nextGrid = placeRoom(initialGrid, firstRoom);
  nextDraw(nextGrid);
};
