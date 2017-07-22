// global constants
export const cellSize = 32;
export const gridHeight = 60;
export const gridWidth = 80;

// helper functions
export const random = (min, max) => (Math.random() * (max - min)) + min;
export const randomInt = (min, max) => Math.floor(random(min, max));

// render to canvas
const drawCell = (x, y, cellType, torch, iconUrl) => {
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  const hue = ((x + y) / 10) % 360;
  const opacity = torch === 0 ? 0 : random(0.3, 0.8);
  const img = new Image();
  switch (cellType) {
    case 'wall':
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
      img.src = iconUrl;
      img.onload = () => {
        ctx.save();
        ctx.globalAlpha = torch;
        ctx.drawImage(img, x, y, cellSize, cellSize);
        ctx.restore();
      };
      if (!iconUrl) {
        ctx.strokeStyle = 'red';
        ctx.rect(x, y, cellSize, cellSize);
        ctx.stroke();
      }
    // else {
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
  });
};

export const updateCells = (newArr, oldArr) => {
  newArr.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      const x = cellSize * cellIdx;
      const y = cellSize * rowIdx;

      if (cell !== oldArr[rowIdx][cellIdx]) {
// change the hard coded 1 in 4th arg to cell.torch
        drawCell(x, y, cell.type, 1, cell.iconUrl);
      }
    });
  });
};

