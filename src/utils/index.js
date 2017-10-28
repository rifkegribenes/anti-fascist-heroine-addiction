// global constants
export const gridHeight = 60;
export const gridWidth = 80;
export const vHeight = 20;
export const vWidth = 20;


// helper functions
export const random = (min, max) => (Math.random() * (max - min)) + min;
export const randomInt = (min, max) => Math.floor(random(min, max));

// render to canvas
const drawCell = (cellSize, ctx, level, x, y, vX, vY, cellType, opacity, hue, iconUrl) => {
  const img = new Image();
  const radius = Math.floor((cellSize) * 0.2) || 2;
  const size = cellSize * 2;
  ctx.clearRect(x, y, cellSize, cellSize);
  switch (cellType) {
    case 'wall':
      ctx.lineJoin = 'round';
      ctx.lineWidth = radius;
      ctx.strokeStyle = `hsl(${hue}, ${100 - ((level - 1) * 10)}%, ${(opacity - (level / 10)) * 100}%)`;
      ctx.strokeRect(x + (radius / 2), y + (radius / 2), cellSize - radius, cellSize - radius);
        // ctx.fillStyle = `rgba(128, 128, 128, ${opacity})`; // gray
      ctx.fillStyle = `hsl(${hue}, ${100 - ((level - 1) * 10)}%, ${(opacity - (level / 10)) * 100}%)`; // rainbow
      ctx.fillRect(x + (radius / 2), y + (radius / 2), cellSize - radius, cellSize - radius);
        // ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${opacity})`;
        // ctx.fillRect(x, y, cellSize, cellSize);
      break;
    case 'floor':
      ctx.fillStyle = `hsl(0, 0%, ${80 - ((level - 1) * 15)}%)`;
      ctx.fillRect(x, y, cellSize, cellSize);
      break;
    case 'hero':
      img.src = iconUrl;
      img.onload = () => {
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'yellow';
        ctx.drawImage(img, x, y, cellSize, cellSize);
        ctx.restore();
      };
      if (!iconUrl) {
        ctx.fillStyle = 'hsla(60, 100%, 50%, 1)';
        ctx.fillRect(x, y, cellSize, cellSize);
      }
      break;
    case 'monster':
      ctx.fillStyle = 'hsla(0, 0%, 80%, 1)';
      ctx.fillRect(x, y, cellSize, cellSize);
      img.src = iconUrl;
      img.onload = () => {
        ctx.save();
        ctx.drawImage(img, x, y, cellSize, cellSize);
        ctx.restore();
      };
      if (!iconUrl) {
        ctx.fillStyle = 'hsla(360, 100%, 50%, 1)';
        ctx.fillRect(x, y, cellSize, cellSize);
      }
      break;
    case 'food':
      ctx.fillStyle = 'hsla(0, 0%, 80%, 1)';
      ctx.fillRect(x, y, cellSize, cellSize);
      img.src = iconUrl;
      img.onload = () => {
        ctx.save();
        ctx.drawImage(img, x, y, cellSize, cellSize);
        ctx.restore();
      };
      if (!iconUrl) {
        ctx.fillStyle = 'hsla(120, 100%, 50%, 1)';
        ctx.fillRect(x, y, cellSize, cellSize);
      }
      break;
    case 'teamHero':
      ctx.fillStyle = 'hsla(0, 0%, 80%, 1)';
      ctx.fillRect(x, y, cellSize, cellSize);
      img.src = iconUrl;
      img.onload = () => {
        ctx.save();
        // console.log(`drawing teamHero at ${x},${y}`);
        ctx.drawImage(img, x, y, cellSize, cellSize);
        ctx.restore();
      };
      if (!iconUrl) {
        ctx.fillStyle = 'hsla(180, 100%, 50%, 1)';
        ctx.fillRect(x, y, cellSize, cellSize);
      }
      break;
    case 'finalMonster':
      if (opacity) {
        img.src = iconUrl;
        img.onload = () => {
          ctx.save();
          ctx.drawImage(img, x, y, size, size);
          ctx.restore();
        };
        if (!iconUrl) {
          ctx.fillStyle = 'black';
          ctx.fillRect(x, y, size, size);
        }
      }
      break;
    case 'staircase':
      img.src = 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/staircase_32_c.png';
      img.onload = () => {
        ctx.save();
        // console.log(`drawing staircase at ${x},${y}`);
        ctx.drawImage(img, x, y, cellSize, cellSize);
        ctx.restore();
      };
      break;
    default:
      ctx.fillStyle = 'hsla(270, 100%, 50%, 1)';
      ctx.fillRect(x, y, cellSize, cellSize);
  }
};

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const renderViewport = (heroPosition, entities, width) => {
  let cellSize;
  if (width > 640) {
    cellSize = 32;
  } else {
    cellSize = Math.floor(width / 20);
  }
  const [hX, hY] = heroPosition;
  const newEntities = entities.map(row => row.map((cell) => {
    const newCell = { ...cell };
    return newCell;
  }));
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); // reset the transform matrix
  ctx.clearRect(0, 0, vWidth * cellSize, vHeight * cellSize);
  // clear  viewport
  // clamp viewport position to grid bounds, center around hero
  const vX = clamp(((hX - (vWidth / 2))), 0, ((gridWidth - vWidth)));
  const vY = clamp(((hY - (vHeight / 2))), 0, ((gridHeight - vHeight)));
  // filter out rows above or below viewport
  newEntities.filter((row, rIdx) => rIdx >= vY && rIdx < (vY + vHeight)).map((r, i) =>
      // filter out cells to left or right of viewport
       r.filter((r2, i2) => i2 >= vX && i2 < (vX + vWidth))
      .map((c, j) => {
        const x = cellSize * j;
        const y = cellSize * i;
        const newCell = { ...c };
        if (!newCell.level) { newCell.level = 1; }
        if (!newCell.hue) { newCell.hue = 0; }
        drawCell(
            cellSize, ctx, newCell.level, x, y, vX, vY,
            newCell.type, newCell.opacity, newCell.hue, newCell.iconUrl,
            );
        return null;
      }));
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

