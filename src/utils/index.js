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
export const isItemInArray = (arr, item) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][0] === item[0] && arr[i][1] === item[1]) {
      return true;
    }
  }
  return false;
};

const move2Door = (neighborCells, entities) =>
  // console.log('move2Door');
   neighborCells.filter(cell => entities[cell[1]][cell[0]].type === 'door')[0];

// handle monster stuck in doorway
const goThroughTheDoor = (entityCoords, prevMoveChange, possibleMoves) => {
  // console.log('trying to go through a door');
  if (prevMoveChange[0] === 0 && prevMoveChange[1] === 0) {
    // console.log('goThroughTheDoor initial/random');
    // then skip all the rest of the logic and just return a random move
    return possibleMoves[randomInt(0, possibleMoves.length - 1)];
  }
  const [cx, cy] = prevMoveChange;
  const [ex, ey] = entityCoords;
  // console.log(`entityCoords: ${entityCoords}`);
  // console.log(`prevMoveChange: ${prevMoveChange}`);
  // console.log(`possibleMoves: ${possibleMoves}`);
  for (let i = 0; i < possibleMoves.length; i++) {
    if (possibleMoves[i][0] === (cx + ex) && possibleMoves[i][1] === (cy + ey)) {
      // console.log('goThroughTheDoor same direction');
      return [ex + cx, ey + cy];
    }
  }
  // console.log('cant go through door, something is in the way, backing up');
  return [ex - cx, ey - cy];
};

const anythingButBack = (entityCoords, prevMoveChange, possibleMoves) => {
  if (prevMoveChange[0] === 0 && prevMoveChange[1] === 0) {
    // console.log('anythingButBack initial/random');
    // then skip all the rest of the logic and just return a random move
    return possibleMoves[randomInt(0, possibleMoves.length - 1)];
  }
  const [cx, cy] = prevMoveChange;
  const [ex, ey] = entityCoords;
  // console.log(`anythingButBack nextMoveSameDir: ${[cx + ex, cy + ey]}`);
  // if next move in same direction is possible, take it
  // console.log('possibleMoves: (is nextMoveSameDir in this list?)');
  // console.log(possibleMoves);
  for (let i = 0; i < possibleMoves.length; i++) {
    if (possibleMoves[i][0] === (cx + ex) && possibleMoves[i][1] === (cy + ey)) {
      return [cx + ex, cy + ey];
    }
  }
  // if not, prioritize a possible move that
  // doesn't take you back the way you came
  const notBackwards = possibleMoves.filter(cell =>
    cell[0] !== ex - cx && cell[1] !== ey - cy);
  if (notBackwards.length) {
    // console.log(`notBackwards random move: ${notBackwards[0]}`);
    return notBackwards[0];
  }
  // if none of those choices work then maybe backwards is your only choice
  // so go ahead and go back. but don't do it next time!!
  // console.log('goin backwards anyway');
  return [ex - cx, ey - cy];
};

const chooseRandomMove = (possibleMoves, entities, entityCoords, doorPriority, prevMoveChange) => {
  // console.log('chooseRandomMove');
  if (doorPriority) {
    const doorCells = possibleMoves.filter(cell => entities[cell[1]][cell[0]].type === 'door');
    if (doorCells.length) {
      // console.log(`chooseRandomMove: ${entities[ey][ex].name} is next2Door`);
      return move2Door(possibleMoves, entities);
    }
  }
  if (prevMoveChange.reduce((a, b) => a + b) !== 0) {
    // console.log('chooseRandomMove: return anythingButBack');
    return anythingButBack(entityCoords, prevMoveChange, possibleMoves);
  }
  // console.log('chooseRandomMove: return randmom from possibleMoves');
  return possibleMoves[randomInt(0, possibleMoves.length - 1)];
};

export const getNeighbors = (coords) => {
  // returns an array containing the x & y coords of each neighbor cell
  const [x, y] = coords;
  return [
  [x + 1, y],
  [x, y + 1],
  [x, y - 1],
  [x - 1, y],
  ];
};

// called from monsterAI
const getPossibleMoves = (entities, entityCoords) => {
  if (entities) {
    // get 4 neighbor cells of current entity coordinates
    const neighbors = getNeighbors(entityCoords);

    // console.log('possibleMoves from getPossibleMoves');
    // console.log(possibleMoves);

    // filter out all but floor, door, & hero cells
    return neighbors.filter(cell =>
      entities[cell[1]][cell[0]].type === 'floor' ||
      entities[cell[1]][cell[0]].type === 'door' ||
      entities[cell[1]][cell[0]].type === 'hero');
  }
  return null;
};

const move2Hero = (neighborCells, entities) =>
  // console.log('move2Hero');
   neighborCells.filter(cell => entities[cell[1]][cell[0]].type === 'hero')[0];

const moveAwayFromMonster = (neighborCells, monsterCells) =>
  neighborCells.filter(cell => !isItemInArray(monsterCells, cell))[0];

// called from monsterAI
// returns an array with xy coords of next move
const moveTowardDoor = (neighborCells, bestDoor, entities, entityCoords, prevMoveChange) => {
  // console.log('moveTowardDoor');
  const [ex, ey] = entityCoords;
  const [bDx, bDy] = bestDoor;
  // console.log(`bDx: ${bDx}, bDy: ${bDy}, ex: ${ex} ey: ${ey}`);
  // console.log('considering these neighor cells for moveTowardDoor:');
  // console.log(neighborCells);
  const closer2BestDoorMoves = neighborCells.filter(cell =>
      (Math.abs(cell[0] - bDx) + (Math.abs(cell[1] - bDy))) <
      (Math.abs(ex - bDx) + Math.abs(ey - bDy)));
  if (closer2BestDoorMoves.length) {
    // console.log('closer2BestDoorMoves:');
    // console.log(closer2BestDoorMoves);
    return closer2BestDoorMoves[0];
  }
  // console.log('moveTowardDoor returned null, choosing random move instead');
  return chooseRandomMove(neighborCells, entities, entityCoords, true, prevMoveChange);
};

// called from monsterAI
// returns an array with xy coords of next move
const moveTowardHero = (neighborCells, entityCoords, heroCoords, entities, prevMoveChange) => {
  // console.log('moveTowardHero');
  const [ex, ey] = entityCoords;
  const [hx, hy] = heroCoords;
  // console.log('considering these neighor cells for moveTowardHero:');
  // console.log(neighborCells);
  const possibleMoves = neighborCells.filter(cell =>
    (Math.abs(cell[0] - hx) + Math.abs(cell[1] - hy)) <
    (Math.abs(ex - hx) + Math.abs(ey - hy)));
  // console.log('possibleMoves closer2hero:');
  // console.log(possibleMoves);

  // if there's only one move, take it!
  if (possibleMoves.length === 1) {
    // console.log('moveTowardHero: only 1 move');
    return possibleMoves[0];
  }

  // if no possible moves bring monster closer to hero
  // (have to go around something in its path), then pick one move at random
  if (!possibleMoves.length) {
    // console.log('moveTowardHero: choosing random from neighbors');
    return chooseRandomMove(neighborCells, entities, entityCoords, false, prevMoveChange);
  }
  // console.log('moveTowardHero: choosing random from possibleMoves');
  return chooseRandomMove(possibleMoves, entities, entityCoords, false, prevMoveChange);
};

const getBestDoor = (doors, entityRoom, entityCoords, heroCoords) => {
  // console.log('getBestDoor');
  // best door must be on border of entity's room
  // AND bring entity closer to hero
  const [hx, hy] = heroCoords;

  // generate array of doors that are on border of monster's room
  const monsterRoomDoors = doors.filter((door) => {
    const { rooms } = door;
    return rooms[0] === entityRoom || rooms[1] === entityRoom;
  });
  // console.log('monsterRoomDoors:');
  // console.log(monsterRoomDoors);

  // of those doors, choose the one that is closest to the hero
  const doorDistances = monsterRoomDoors.map(door =>
    Math.abs(door.coords[0] - hx) + Math.abs(door.coords[1] - hy));
  const indexOfClosestDoor = doorDistances.indexOf(Math.min(...doorDistances));
  const closestDoor = monsterRoomDoors[indexOfClosestDoor];
  // console.log('closestDoor:');
  // console.log(closestDoor);
  if (!closestDoor) {
    return null;
  }

  return closestDoor.coords;
};

// called from Board.jsx > monsterMovement()
// returns an array with xy coords of next move
export const monsterAI = (entities, entityCoords, heroCoords, doors, heroRoom, prevMoveChange) => {
  const [ex, ey] = entityCoords;
  const entity = entities[ey][ex];
  // console.log(`monsterAI ${entity.name} ////////////////`);

  // find cells to N,S,E, & W of monster's current position
  // that are valid move types (floor, door, hero, not next to another monster)
  const neighborCells = getPossibleMoves(entities, entityCoords);
  // console.log('possibleMoves valid neighbor cells:');
  // console.log(neighborCells);

  // is the entity right next to the hero? if so, that's the next move
  const heroCells = neighborCells.filter(cell => entities[cell[1]][cell[0]].type === 'hero');
  if (heroCells.length) {
    // console.log(`${entities[ey][ex].name} nextToHero`);
    return move2Hero(neighborCells, entities);
  }

  // is the entity right next to another monstre? if so, move away to avoid
  // race conditions with the AI / monsters 'eating' each other in the grid
  const monsterCells = neighborCells.filter(cell => entities[cell[1]][cell[0]].type === 'monster' || entities[cell[1]][cell[0]].type === 'finalMonster');
  if (monsterCells.length) {
    console.log(`${entities[ey][ex].name} moveAwayFromMonster`);
    return moveAwayFromMonster(neighborCells, monsterCells);
  }

  // is the entity in a doorway? if so, finish going through it
  if (entity.room === 'door') {
    return goThroughTheDoor(entityCoords, prevMoveChange, neighborCells);
  }

  // are monster and hero in different rooms? if so, look for the door
  // out of the monster's current room that brings him closest to hero
  if (entity.room !== heroRoom) {
    // console.log(`${entities[ey][ex].name}
    // is in room ${Math.floor(entity.room)} at ${entityCoords}.
    //   Hero is in room ${Math.floor(heroRoom)}
    //   at ${heroCoords}. Calling getBestDoor.`);
    const bestDoor = getBestDoor(doors, entity.room, entityCoords, heroCoords);
    if (!bestDoor) {
      return chooseRandomMove(getPossibleMoves(entities, entityCoords),
        entities, entityCoords, true, prevMoveChange);
    }
    return moveTowardDoor(neighborCells, bestDoor, entities, entityCoords, prevMoveChange);
  }

  // if hero and monster are in same room, move toward hero
  // console.log(`${entities[ey][ex].name} is in room ${Math.floor(entity.room)} at ${entityCoords}.
  //     Hero is in room ${Math.floor(heroRoom)} at ${heroCoords}. Calling moveTowardHero.`);
  return moveTowardHero(neighborCells, entityCoords, heroCoords, entities, prevMoveChange);
};

// render to canvas
// called from renderViewport
// if need coords printed: (cellSize, ctx, cell, x, y, vX, vY)
const drawCell = (cellSize, ctx, cell, x, y, candle, key) => {
  // console.log(`drawCell: vX: ${vX}, vY: ${vY}, x: ${x}, y: ${y}`);
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
      if (key) {
        // console.log('key');
      }
      // ctx.font = '8px Arial Narrow';
      // ctx.fillStyle = 'black';
      // ctx.fillText(`${Math.floor(cell.room)}`, x, y);
      // ctx.fillText(`[${(x / cellSize) + vX},`, x, y + 8);
      // ctx.fillText(`${(y / cellSize) + vY}]`, x, y + 16);
      ctx.fillStyle = `hsl(0, 0%, ${80 - ((cell.level - 1) * 15)}%)`;
      ctx.fillRect(x, y, cellSize, cellSize);
      break;
    case 'hero':
    case 'candle':
    case 'key':
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
      if (cell.title === 'Invisible Sufganiyah') {
        // console.log(`drawing sufganiyah at ${x * cellSize}, ${y * cellSize}`);
        if (candle === true) {
          img.onload = () => {
            ctx.save();
            ctx.drawImage(img, x, y, cellSize, cellSize);
            ctx.restore();
          };
        }
      } else {
        img.onload = () => {
          ctx.save();
          ctx.drawImage(img, x, y, cellSize, cellSize);
          ctx.restore();
        };
      }
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

// called from Board.jsx > draw()
export const renderViewport = (heroPosition, entities, cellSize,
  prevVP, candle, key) => {
  const [hX, hY] = heroPosition;
  // console.log(`hX: ${hX}, hY: ${hY}`);
  const newEntities = entities.map(row => row.map((cell) => {
    const newCell = { ...cell };
    return newCell;
  }));
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  // reset the transform matrix
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // clear viewport
  // ctx.clearRect(0, 0, vWidth * cellSize, vHeight * cellSize);
  // clamp viewport position to grid bounds, center around hero
  const vX = clamp(((hX - (vWidth / 2))), 0, ((gridWidth - vWidth))); // 30
  const vY = clamp(((hY - (vHeight / 2))), 0, ((gridHeight - vHeight))); // 20
  // console.log(`vWidth: ${vWidth}, vHeight: ${vHeight}`);
  // console.log(`gridWidth: ${gridWidth}, gridHeight: ${gridHeight}`);
  // console.log(`vX: ${vX}, vY: ${vY}`);
  // filter out rows above or below viewport,
  // return current viewport to save to app state
  return newEntities.filter((row, rIdx) => rIdx >= vY && rIdx < (vY + vHeight)).map((r, i) =>
      // filter out cells to left or right of viewport
       r.filter((r2, i2) => i2 >= vX && i2 < (vX + vWidth))
      .map((c, j) => {
        const x = cellSize * j;
        const y = cellSize * i;
        const newCell = { ...c };
        // only draw cells if they are DIFFERENT from last viewport update
        if (!prevVP) {
          if (!newCell.level) { newCell.level = 1; }
          if (!newCell.hue) { newCell.hue = 0; }
          drawCell(cellSize, ctx, newCell, x, y, vX, vY, candle, key);
          // console.log(`cell at ${(x / cellSize) + vX},
          // ${(y / cellSize) + vY} has changed, re-drawing`);
          return newCell;
        }
        const prevCell = prevVP[i][j];
        if (newCell.type !== prevCell.type ||
          newCell.name !== prevCell.name ||
          newCell.opacity !== prevCell.opacity ||
          newCell.hue !== prevCell.hue) {
          if (!newCell.level) { newCell.level = 1; }
          if (!newCell.hue) { newCell.hue = 0; }
          drawCell(cellSize, ctx, newCell, x, y, candle, key);
          // console.log(`cell at ${(x / cellSize) + vX},${(y / cellSize) + vY} has changed:`);
          // console.log('prevCell:');
          // console.log(prevCell);
          // console.log('newCell:');
          // console.log(newCell);
          return newCell;
        }
        // console.log(`cell at ${(x / cellSize) + vX},${(y / cellSize) + vY} NOT CHANGED`);
        return newCell;
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

export const shake = ['shake', 'shake-hard', 'shake-rotate', 'shake-crazy'];

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

export const animate = () => {
  let lastTime = 0;
  const vendors = ['ms', 'moz', 'webkit', 'o'];
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`];
    window.cancelAnimationFrame = window[`${vendors[x]}CancelAnimationFrame`]
    || window[`${vendors[x]}CancelRequestAnimationFrame`];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (callback) => {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(() => { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (id) => {
      clearTimeout(id);
    };
  }
};
