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
const drawCell = (x, y, cellType, torch, iconUrl) => {
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const hue = ((x+y) / 10) % 360;
switch (cellType) {
  case 'wall':
    let opacity = torch === 0 ? 0 : random(0.3, 0.8);
    ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${opacity})`;
    ctx.fillRect(x, y, cellSize, cellSize);
    break;
  case 'floor':
    ctx.fillStyle = `hsla(0, 0%, 80%, ${torch})`;
    ctx.fillRect(x, y, cellSize, cellSize);
    break;
  case 'hero':
    ctx.fillStyle = `hsla(60, 100%, 50%, ${torch})`;
    ctx.fillRect(x, y, cellSize, cellSize);
    break;
  case 'monster':
    ctx.fillStyle = `hsla(360, 100%, 50%, ${torch})`;
    ctx.fillRect(x, y, cellSize, cellSize);
    break;
  case 'food':
    ctx.fillStyle = `hsla(120, 100%, 50%, ${torch})`;
    ctx.fillRect(x, y, cellSize, cellSize);
    break;
  case 'animal':
    ctx.fillStyle = `hsla(0, 0%, 80%, ${torch})`;
    ctx.fillRect(x, y, cellSize, cellSize);
    var img = new Image();
    img.src = iconUrl // || 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1018136/baby-hippo.gif';
    img.onload = function() {
      ctx.save();
      ctx.globalAlpha = torch;
      ctx.drawImage(img, x, y, cellSize, cellSize);
      ctx.restore();
    };
    // if (!iconUrl) {
    // ctx.strokeStyle="red";
    // ctx.rect(x, y, cellSize, cellSize);
    // ctx.stroke();
    // } else {
    // ctx.strokeStyle="green";
    // ctx.rect(x, y, cellSize, cellSize);
    // ctx.stroke();
    // }
    break;
  case 'boss':
    ctx.fillStyle = `hsla(30, 100%, 50%, ${torch})`;
    ctx.fillRect(x, y, cellSize, cellSize);
    break;
  case 'staircase':
    ctx.fillStyle = `hsla(0, 0, 40%, ${torch})`;
    ctx.fillRect(x, y, cellSize, cellSize);
    break;
  default:
    ctx.fillStyle = `hsla(270, 100%, 50%, ${torch})`;
    ctx.fillRect(x, y, cellSize, cellSize);
}

};

export const drawCells = (arr) => {
arr.forEach((row, rowIdx) => {
  row.forEach((cell, cellIdx) => {
    const x = cellSize * cellIdx;
    const y = cellSize * rowIdx;
    if (cell !== 'x') {
// change the hard coded 1 in 4th arg to cell.torch
    drawCell(x, y, cell.type, 1, cell.iconUrl);
  }
});
})
};

