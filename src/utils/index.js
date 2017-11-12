// global constants
export const gridHeight = 60;
export const gridWidth = 80;
export const vHeight = 20;
export const vWidth = 20;


// helper functions
export const random = (min, max) => (Math.random() * (max - min)) + min;
export const randomInt = (min, max) => Math.floor(random(min, max));
export const inViewport = (entityCoords, heroCoords) => {
  const [ex, ey] = entityCoords;
  const [hx, hy] = heroCoords;
  if (Math.abs(ex - hx) <= vWidth / 2 && Math.abs(ey - hy) <= vHeight / 2) {
    return true;
  }
  return false;
};
const getNearestDoor = (doors, entityCoords) => {
  // find nearest door
  // maximum room wall size is 12 cells
  // so door can't be more than 12 cells away in any direction
  const [eX, eY] = entityCoords;
  console.log(`looking for nearest door to ${entityCoords}`);
  console.log(`possible doors: ${doors}`);
  // calculate distance of each door in array from entity coords
  const doorsDistance = doors.map(door => Math.abs(door[0] - eX) + Math.abs(door[1] - eY));
  // find closest distance
  const nearestDoorDistance = Math.min(...doorsDistance);
  console.log(`nearest door to ${entityCoords} is ${doors[doorsDistance.indexOf(nearestDoorDistance)]}`);
  // return coordinates of closest door
  return doors[doorsDistance.indexOf(nearestDoorDistance)];
};

const getNeighbors = (entities, entityCoords) => {
  // returns an array containing the x & y coords of each neighbor cell
  // plus the entity object at that location
  const [ex, ey] = entityCoords;
  const neighbors = [
    [[ex + 1, ey], entities[ey][ex + 1]],
    [[ex, ey + 1], entities[ey + 1][ex]],
    [[ex, ey - 1], entities[ey - 1][ex]],
    [[ex - 1, ey], entities[ey][ex - 1]],
  ];
  // filter out cells that are not possible moves
  // (only include floor, door, & hero cells)
  return neighbors.filter(cell =>
    cell[1].type === 'floor' ||
    cell[1].type === 'door' ||
    cell[1].type === 'hero',
    );
};


export const monsterAI = (entities, entityCoords, heroCoords, doors) => {
  const [ex, ey] = entityCoords;
  const [hx, hy] = heroCoords;

  // find cells to N,S,E, & W of monster's current position
  const neighborCells = getNeighbors(entities, entityCoords);

  // is the entity right next to the hero? if so, that's the next move
  let nextToHero = false;
  const heroCells = neighborCells.filter(cell => cell[1].type === 'hero');
  if (heroCells.length) {
    nextToHero = true;
  }
  if (nextToHero) {
    console.log(`${entities[ey][ex].name} is nextToHero`);
    console.log(neighborCells.filter(cell => cell[1].type === 'hero'));
    return neighborCells.filter(cell => cell[1].type === 'hero');
  }

  // is there a wall between the monster and the hero? if so, look for
  // nearest door instead

  // filter neighbor cells to return only choices that move monster closer to the hero
  let possibleMoves = neighborCells.filter(cell =>
    (Math.abs(cell[0][0] - hx) + Math.abs(cell[0][1] - hy)) <
    (Math.abs(ex - hx) + Math.abs(ey - hy)));
  console.log(`possible closer2hero moves for ${entities[ey][ex].name}:`);
  console.log(possibleMoves);

  // if there are multiple possible moves, choose the one that also brings
  // monster closer to nearest door
  if (possibleMoves.length > 1) {
    console.log(`${entities[ey][ex].name} has multiple closer2hero moves, looking for closer2door move`);

    // get coords of nearest door
    const [dx, dy] = getNearestDoor(doors, entityCoords);
    console.log(`${entities[ey][ex].name} nearest door: ${dx}, ${dy}`);
    const closer2DoorMoves = possibleMoves
    .filter(cell =>
      (Math.abs(cell[0][0] - dx) + (Math.abs(cell[0][1] - dy))) <
      (Math.abs(ex - dx) + Math.abs(ey - dy)));
    console.log(`closer2door moves for ${entities[ey][ex].name}:`);
    console.log(closer2DoorMoves);
    if (closer2DoorMoves.length) {
      return closer2DoorMoves[0];
    }
  }

  // if there are no possible moves, then look for a move that
  // brings monster closer to nearest door
  if (!possibleMoves.length) {
    console.log(`${entities[ey][ex].name} has no possible moves to bring him closer to hero, looking for nearest door instead`);

    // get coords of nearest door
    const [dx, dy] = getNearestDoor(doors, entityCoords);
    console.log(`${entities[ey][ex].name} nearest door: ${dx}, ${dy}`);
    possibleMoves = neighborCells.filter(cell =>
      (Math.abs(cell[0][0] - dx) + (Math.abs(cell[0][1] - dy))) <
      (Math.abs(ex - dx) + Math.abs(ey - dy)));
    console.log(`possible closer2door moves for ${entities[ey][ex].name}:`);
    console.log(possibleMoves);
  }


  // if none exists (have to go around something in its path), then pick one move at random
  if (!possibleMoves.length) {
    console.log(`${entities[ey][ex].name} has no good moves, choosing one at random instead`);
    console.log(`moving to: ${neighborCells[Math.floor(random(0, 3))]}`);
    return neighborCells[Math.floor(random(0, 3))];
  }

  // if one of the possible moves is a door, choose that one
  let nextToDoor = false;
  const doorCells = possibleMoves.filter(cell => cell[1].type === 'door');
  if (doorCells.length) {
    nextToDoor = true;
  }
  if (nextToDoor) {
    console.log(`${entities[ey][ex].name} is next to a door`);
    console.log(possibleMoves.filter(cell => cell[1].type === 'door'));
    return possibleMoves.filter(cell => cell[1].type === 'door');
  }

  // otherwise, choose one of the possible moves at random
  const chosenMove = Math.floor(random(0, possibleMoves.length - 1));
  return possibleMoves[chosenMove];
};

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
    case 'door':
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

export const renderViewport = (heroPosition, entities, cellSize) => {
  console.log('renderV');
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
        // TODO:
        // add logic here to only draw cells if they are DIFFERENT from
        // last tick (need to pass last state into this function to compare)
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

// message generation utilities

export const goodNews = ['Awesome', 'Sweet', 'Yee-hah', 'Hurrah', 'Yay', 'Nice', 'Jeepers', 'Golly', 'Neat', 'Score', 'Whee', 'OMG', 'Woohoo', 'Willya look at that'];

export const badNews = ['Bummer', 'Raw deal', 'Dang', 'Crud', 'Uh oh', 'Crikey', 'Bad news', 'Crap on a cracker', 'Doggone it', 'Drat', 'Y i k e s', 'Oh dear', 'Welp', 'Too bad'];
