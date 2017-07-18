// global constants
export const cellSize = 30;
export const gridHeight = 60
export const gridWidth = 80;

// helper functions
export const random = (min, max) => (Math.random() * (max - min)) + min;
export const randomInt = (min, max) => Math.floor(random(min, max));

// render to canvas
const drawCell = (x, y, cellType) => {
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const opacity = random(0.3, 0.8);
const hue = ((x+y) / 10) % 360;
switch (cellType) {
  case 'wall':
    ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${opacity})`;
    break;
  case 'floor':
    ctx.fillStyle = 'black';
    break;
  case 'hero':
    ctx.fillStyle = 'yellow';
    break;
  case 'monster':
    ctx.fillStyle = 'red';
    break;
  case 'food':
    ctx.fillStyle = 'green';
    break;
  case 'animal':
    ctx.fillStyle = 'blue';
    break;
  case 'boss':
    ctx.fillStyle = 'orange';
    break;
  case 'staircase':
    ctx.fillStyle = 'gray';
    break;
  default:
    ctx.fillStyle = 'purple';
}
ctx.fillRect(x, y, cellSize, cellSize);
};

export const drawCells = (arr) => {
arr.forEach((row, rowIdx) => {
  row.forEach((cell, cellIdx) => {
    const x = cellSize * cellIdx;
    const y = cellSize * rowIdx;
    if (cell !== 'x') {
    drawCell(x, y, cell.type);
  }
});
})
};
