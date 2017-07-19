// global constants
export const cellSize = 32;
export const gridHeight = 60
export const gridWidth = 80;

// helper functions
export const random = (min, max) => (Math.random() * (max - min)) + min;
export const randomInt = (min, max) => Math.floor(random(min, max));

// image import
import fox from '../img/baby-fox.gif';
import hippo from '../img/baby-hippo.gif';

// render to canvas
const drawCell = (x, y, cellType, img) => {
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const opacity = random(0.3, 0.8);
const hue = ((x+y) / 10) % 360;
switch (cellType) {
  case 'wall':
    ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${opacity})`;
    ctx.fillRect(x, y, cellSize, cellSize);
    break;
  case 'floor':
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, cellSize, cellSize);
    break;
  case 'hero':
    ctx.fillStyle = 'yellow';
    ctx.fillRect(x, y, cellSize, cellSize);
    break;
  case 'monster':
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, cellSize, cellSize);
    break;
  case 'food':
    ctx.fillStyle = 'green';
    ctx.fillRect(x, y, cellSize, cellSize);
    break;
  case 'animal':
    var img = new Image();
    img.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1018136/baby-hippo.gif';
    img.addEventListener('load', function() {
  ctx.drawImage(img, x, y, cellSize, cellSize);
}, false);
    // ctx.strokeStyle="white";
    // ctx.rect(x, y, cellSize, cellSize);
    // ctx.stroke();
    break;
  case 'boss':
    ctx.fillStyle = 'orange';
    ctx.fillRect(x, y, cellSize, cellSize);
    break;
  case 'staircase':
    ctx.fillStyle = 'gray';
    ctx.fillRect(x, y, cellSize, cellSize);
    break;
  default:
    ctx.fillStyle = 'purple';
    ctx.fillRect(x, y, cellSize, cellSize);
}

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
