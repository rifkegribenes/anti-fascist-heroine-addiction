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
  if (Math.abs(ex - hx) < vWidth / 2 && Math.abs(ey - hy) < vHeight / 2) {
    return true;
  }
  return false;
};

const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) { return false; }
  for (let i = arr1.length; i--;) {
    if (arr1[i] !== arr2[i]) { return false; }
  }
  return true;
};

const move2Door = (neighborCells, entities) => {
  console.log(neighborCells.filter(cell => entities[cell[1]][cell[0]].type === 'door'));
  return neighborCells.filter(cell => entities[cell[1]][cell[0]].type === 'door');
};

// this function handles 'stalemate' situations where monsters get stuck
// in corners or doorways repeating the same 2-move sequence
const anythingButBack = (entityCoords, prevMoveChange, possibleMoves) => {
  console.log(`prevMoveChange: ${prevMoveChange}`);
  if (prevMoveChange === [0, 0]) {
    // then skip all the rest of the logic and just return a random move
    return possibleMoves[randomInt(0, possibleMoves.length - 1)];
  }
  const [cx, cy] = prevMoveChange;
  const [ex, ey] = entityCoords;
  console.log(`next move in same direction would be: ${[cx + ex, cy + ey]}`);
  // if next move in same direction is possible, take it
  console.log('possibleMoves: (is next move in this list?)');
  console.log(possibleMoves);
  let nextMoveInList;
  for (let i = possibleMoves.length; i--;) {
    if (arraysEqual(i, [cx + ex, cy + ey])) {
      nextMoveInList = true;
    }
    nextMoveInList = false;
  }
  if (nextMoveInList) {
    return [cx + ex, cy + ey];
  }
  // if not, prioritize a possible move that
  // doesn't take you back the way you came
  const notBackwards = possibleMoves.filter(cell =>
    cell[0] !== ex - cx && cell[1] !== ey - cy);
  if (notBackwards.length) {
    console.log(`non-backwards random move: ${notBackwards[0]}`);
    return notBackwards[0];
  }
  // if none of those choices work then maybe backwards is your only choice
  // so go ahead and go back. but don't do it next time!!
  return [ex - cx, ey - cy];
};

const chooseRandomMove = (possibleMoves, entities, entityCoords, doorPriority, prevMoveChange) => {
  const [ex, ey] = entityCoords;
  if (doorPriority) {
    const doorCells = possibleMoves.filter(cell => entities[cell[1]][cell[0]].type === 'door');
    if (doorCells.length) {
      console.log(`${entities[ey][ex].name} is next to a door`);
      console.log(possibleMoves.filter(cell => entities[cell[1]][cell[0]].type === 'door'));
      return move2Door(possibleMoves, entities);
    }
  }
  if (prevMoveChange !== [0, 0]) {
    return anythingButBack(entityCoords, prevMoveChange, possibleMoves);
  }
  return possibleMoves[randomInt(0, possibleMoves.length - 1)];
};

export const getNeighbors = (entities, entityCoords) => {
  // returns an array containing the x & y coords of each neighbor cell
  const [ex, ey] = entityCoords;
  const neighbors = [
    [ex + 1, ey],
    [ex, ey + 1],
    [ex, ey - 1],
    [ex - 1, ey],
  ];
  // filter out cells that are not possible moves
  // (only include floor, door, & hero cells)
  return neighbors.filter(cell =>
    entities[cell[1]][cell[0]].type === 'floor' ||
    entities[cell[1]][cell[0]].type === 'door' ||
    entities[cell[1]][cell[0]].type === 'hero');
};

const move2Hero = (neighborCells, entities) => {
  console.log(neighborCells.filter(cell => entities[cell[1]][cell[0]].type === 'hero'));
  return neighborCells.filter(cell => entities[cell[1]][cell[0]].type === 'hero');
};

const moveTowardDoor = (neighborCells, bestDoor, entities, entityCoords, prevMoveChange) => {
  const [ex, ey] = entityCoords;
  const [bDx, bDy] = bestDoor;
  // choose a move that brings monster closer to the best door
  // neighborCells.forEach((cell, idx) => {
  //   console.log(`distance from best door of neighbor cell ${idx} (${cell}):`);
  //   console.log(`distanceX = ${(Math.abs(cell[0] - bDx))}.
  //   distanceY = ${(Math.abs(cell[1] - bDy))}`);
  //   console.log(`distance sum = ${(Math.abs(cell[0] - bDx)) + (Math.abs(cell[1] - bDy))}`);
  // });
  const closer2BestDoorMoves = neighborCells.filter(cell =>
      (Math.abs(cell[0] - bDx) + (Math.abs(cell[1] - bDy))) <
      (Math.abs(ex - bDx) + Math.abs(ey - bDy)));
  console.log(`closer2Bestdoor moves for ${entities[ey][ex].name}:`);
  console.log(closer2BestDoorMoves);
  if (closer2BestDoorMoves.length) {
    return closer2BestDoorMoves[0];
  }
  console.log('moveTowardDoor returned null, choosing random move instead');
  return chooseRandomMove(neighborCells, entities, entityCoords, true, prevMoveChange);
};

const moveTowardHero = (neighborCells, entityCoords, heroCoords, entities, prevMoveChange) => {
  const [ex, ey] = entityCoords;
  const [hx, hy] = heroCoords;
  const possibleMoves = neighborCells.filter(cell =>
    (Math.abs(cell[0] - hx) + Math.abs(cell[1] - hy)) <
    (Math.abs(ex - hx) + Math.abs(ey - hy)));
  console.log(`possible closer2hero moves for ${entities[ey][ex].name}:`);
  console.log(possibleMoves);

  // if there's only one move, take it!
  if (possibleMoves.length === 1) {
    return possibleMoves[0];
  }

  // if no possible moves bring monster closer to hero
  // (have to go around something in its path), then pick one move at random
  if (!possibleMoves.length) {
    console.log(`${entities[ey][ex].name} has no good moves, choosing one at random instead`);
    return chooseRandomMove(neighborCells, entities, entityCoords, false, prevMoveChange);
  }
  return chooseRandomMove(possibleMoves, entities, entityCoords, false, prevMoveChange);
};

const getBestDoor = (doors, entityRoom, entityCoords, heroCoords) => {
  // best door must be on border of entity's room
  // AND bring entity closer to hero
  const [hx, hy] = heroCoords;

  // generate array of doors that are on border of monster's room
  const monsterRoomDoors = doors.filter((door) => {
    const { rooms } = door;
    return rooms[0] === entityRoom || rooms[1] === entityRoom;
  });
  console.log(`these doors adjoin the room containing ${entityCoords}:`);
  console.log(monsterRoomDoors);

  // of those doors, choose the one that is closest to the hero
  const doorDistances = monsterRoomDoors.map(door =>
    Math.abs(door.coords[0] - hx) + Math.abs(door.coords[1] - hy));
  console.log('doorDistances: ');
  console.log(doorDistances);
  console.log(`smallest distance = ${Math.min(doorDistances)}`);
  const indexOfClosestDoor = doorDistances.indexOf(Math.min(...doorDistances));
  console.log(`indexOfClosestDoor: ${indexOfClosestDoor}`);
  const closestDoor = monsterRoomDoors[indexOfClosestDoor];
  console.log(`best door = ${closestDoor.coords}`);

  return closestDoor.coords;
};

// returns an array with xy coords of next move.
export const monsterAI = (entities, entityCoords, heroCoords, doors, heroRoom, prevMoveChange) => {
  console.log(`monsterAI prevMoveChange: ${prevMoveChange}`);
  const [ex, ey] = entityCoords;
  const entity = entities[ey][ex];

  // find cells to N,S,E, & W of monster's current position
  const neighborCells = getNeighbors(entities, entityCoords);

  // is the entity right next to the hero? if so, that's the next move
  const heroCells = neighborCells.filter(cell => entities[cell[1]][cell[0]].type === 'hero');
  if (heroCells.length) {
    console.log(`${entities[ey][ex].name} is nextToHero. Next move:`);
    console.log(neighborCells.filter(cell => entities[cell[1]][cell[0]].type === 'hero'));
    return move2Hero(neighborCells, entities);
  }

  // is the entity in a doorway? if so, finish going through it
  if (entity.room === 'door') {
    console.log(`${entity.name} IS IN A DOORWAY (utils)`);
    return anythingButBack(entityCoords, prevMoveChange, neighborCells);
  }

  // are monster and hero in different rooms? if so, look for the door
  // out of the monster's current room that brings him closest to hero
  if (entity.room !== heroRoom) {
    console.log(`${entity.name} is in room ${entities[ey][ex].room}. hero is in room ${heroRoom}. (should be different) Look for best door`);
    const bestDoor = getBestDoor(doors, entity.room, entityCoords, heroCoords);
    return moveTowardDoor(neighborCells, bestDoor, entities, entityCoords, prevMoveChange);
  }

  // if hero and monster are in same room, move toward hero
  console.log(`${entity.name} is in room ${entity.room}. hero is in room ${heroRoom}. (should be same) look for best move`);
  return moveTowardHero(neighborCells, entityCoords, heroCoords, entities, prevMoveChange);
};

// render to canvas
const drawCell = (cellSize, ctx, cell, x, y, vX, vY) => {
  const img = new Image();
  const radius = Math.floor((cellSize) * 0.2) || 2;
  const size = cellSize * 2;
  ctx.clearRect(x, y, cellSize, cellSize);
  switch (cell.type) {
    case 'wall':
      ctx.lineJoin = 'round';
      ctx.lineWidth = radius;
      ctx.strokeStyle = `hsl(${cell.hue}, ${100 - ((cell.level - 1) * 10)}%, ${(cell.opacity - (cell.level / 10)) * 100}%)`;
      ctx.strokeRect(x + (radius / 2), y + (radius / 2), cellSize - radius, cellSize - radius);
        // ctx.fillStyle = `rgba(128, 128, 128, ${opacity})`; // gray
      ctx.fillStyle = `hsl(${cell.hue}, ${100 - ((cell.level - 1) * 10)}%, ${(cell.opacity - (cell.level / 10)) * 100}%)`; // rainbow
      ctx.fillRect(x + (radius / 2), y + (radius / 2), cellSize - radius, cellSize - radius);
        // ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${opacity})`;
        // ctx.fillRect(x, y, cellSize, cellSize);
      break;
    case 'floor':
    case 'door':
      ctx.font = '10px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(`[${(x / cellSize) + 30},${(y / cellSize) + 20}]`, x, y);
      ctx.fillText(`${Math.floor(cell.room)}`, x, y + 10);
      // ctx.fillStyle = `hsl(0, 0%, ${80 - ((level - 1) * 15)}%)`;
      // ctx.fillRect(x, y, cellSize, cellSize);
      break;
    case 'hero':
      img.src = cell.iconUrl;
      img.onload = () => {
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'yellow';
        ctx.drawImage(img, x, y, cellSize, cellSize);
        ctx.restore();
      };
      if (!cell.iconUrl) {
        ctx.fillStyle = 'hsla(60, 100%, 50%, 1)';
        ctx.fillRect(x, y, cellSize, cellSize);
      }
      break;
    case 'monster':
      ctx.fillStyle = 'hsla(0, 0%, 80%, 1)';
      ctx.fillRect(x, y, cellSize, cellSize);
      img.src = cell.iconUrl;
      img.onload = () => {
        ctx.save();
        ctx.drawImage(img, x, y, cellSize, cellSize);
        ctx.restore();
      };
      if (!cell.iconUrl) {
        ctx.fillStyle = 'hsla(360, 100%, 50%, 1)';
        ctx.fillRect(x, y, cellSize, cellSize);
      }
      break;
    case 'food':
      ctx.fillStyle = 'hsla(0, 0%, 80%, 1)';
      ctx.fillRect(x, y, cellSize, cellSize);
      img.src = cell.iconUrl;
      img.onload = () => {
        ctx.save();
        ctx.drawImage(img, x, y, cellSize, cellSize);
        ctx.restore();
      };
      if (!cell.iconUrl) {
        ctx.fillStyle = 'hsla(120, 100%, 50%, 1)';
        ctx.fillRect(x, y, cellSize, cellSize);
      }
      break;
    case 'teamHero':
      ctx.fillStyle = 'hsla(0, 0%, 80%, 1)';
      ctx.fillRect(x, y, cellSize, cellSize);
      img.src = cell.iconUrl;
      img.onload = () => {
        ctx.save();
        // console.log(`drawing teamHero at ${x},${y}`);
        ctx.drawImage(img, x, y, cellSize, cellSize);
        ctx.restore();
      };
      if (!cell.iconUrl) {
        ctx.fillStyle = 'hsla(180, 100%, 50%, 1)';
        ctx.fillRect(x, y, cellSize, cellSize);
      }
      break;
    case 'finalMonster':
      if (cell.opacity) {
        img.src = cell.iconUrl;
        img.onload = () => {
          ctx.save();
          ctx.drawImage(img, x, y, size, size);
          ctx.restore();
        };
        if (!cell.iconUrl) {
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
        drawCell(cellSize, ctx, newCell, x, y, vX, vY);
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
