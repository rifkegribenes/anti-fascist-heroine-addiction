// global constants
export const gridHeight = 60;
export const gridWidth = 80;
export const vSize = 20;


// helper functions
export const random = (min, max) => (Math.random() * (max - min)) + min;
export const randomInt = (min, max) => Math.floor(random(min, max));
export const inViewport = (entityCoords, heroCoords) => {
  const [ex, ey] = entityCoords;
  const [hx, hy] = heroCoords;
  if (Math.abs(ex - hx) < vSize / 2 && Math.abs(ey - hy) < vSize / 2) {
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
   neighborCells.filter(cell => entities[cell[1]][cell[0]].type === 'door')[0];

// handle monster stuck in doorway
const goThroughTheDoor = (entityCoords, prevMoveChange, possibleMoves) => {
  if (prevMoveChange[0] === 0 && prevMoveChange[1] === 0) {
    // if this is the first time the monster has moved in this level,
    // then there is no prevMove value
    // so skip all the rest of the logic and just return a random move
    return possibleMoves[randomInt(0, possibleMoves.length - 1)];
  }
  const [cx, cy] = prevMoveChange;
  const [ex, ey] = entityCoords;
  for (let i = 0; i < possibleMoves.length; i++) {
    if (possibleMoves[i][0] === (cx + ex) && possibleMoves[i][1] === (cy + ey)) {
      return [ex + cx, ey + cy];
    }
  }
  return [ex - cx, ey - cy];
};

const anythingButBack = (entityCoords, prevMoveChange, possibleMoves) => {
  if (prevMoveChange[0] === 0 && prevMoveChange[1] === 0) {
    // if this is the first time the monster has moved in this level,
    // then there is no prevMove value
    // so skip all the rest of the logic and just return a random move
    return possibleMoves[randomInt(0, possibleMoves.length - 1)];
  }
  const [cx, cy] = prevMoveChange;
  const [ex, ey] = entityCoords;
  // if next move in same direction is possible, take it
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
    return notBackwards[0];
  }
  // if none of those choices work then maybe backwards is your only choice
  // so go ahead and go back.
  return [ex - cx, ey - cy];
};

const chooseRandomMove = (possibleMoves, entities, entityCoords, doorPriority, prevMoveChange) => {
  if (doorPriority) {
    const doorCells = possibleMoves.filter(cell => entities[cell[1]][cell[0]].type === 'door');
    if (doorCells.length) {
      return move2Door(possibleMoves, entities);
    }
  }
  if (prevMoveChange.reduce((a, b) => a + b) !== 0) {
    return anythingButBack(entityCoords, prevMoveChange, possibleMoves);
  }
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

    // filter out all but floor, door, & hero cells
    return neighbors.filter(cell =>
      entities[cell[1]][cell[0]].type === 'floor' ||
      entities[cell[1]][cell[0]].type === 'door' ||
      entities[cell[1]][cell[0]].type === 'hero');
  }
  return null;
};

const move2Hero = (neighborCells, entities) =>
   neighborCells.filter(cell => entities[cell[1]][cell[0]].type === 'hero')[0];

const moveAwayFromMonster = (neighborCells, monsterCells) =>
  neighborCells.filter(cell => !isItemInArray(monsterCells, cell))[0];

// called from monsterAI
// returns an array with xy coords of next move
const moveTowardDoor = (neighborCells, bestDoor, entities, entityCoords, prevMoveChange) => {
  const [ex, ey] = entityCoords;
  const [bDx, bDy] = bestDoor;
  const closer2BestDoorMoves = neighborCells.filter(cell =>
      (Math.abs(cell[0] - bDx) + (Math.abs(cell[1] - bDy))) <
      (Math.abs(ex - bDx) + Math.abs(ey - bDy)));
  if (closer2BestDoorMoves.length) {
    return closer2BestDoorMoves[0];
  }
  return chooseRandomMove(neighborCells, entities, entityCoords, true, prevMoveChange);
};

// called from monsterAI
// returns an array with xy coords of next move
const moveTowardHero = (neighborCells, entityCoords, heroCoords, entities, prevMoveChange) => {
  const [ex, ey] = entityCoords;
  const [hx, hy] = heroCoords;
  const possibleMoves = neighborCells.filter(cell =>
    (Math.abs(cell[0] - hx) + Math.abs(cell[1] - hy)) <
    (Math.abs(ex - hx) + Math.abs(ey - hy)));

  // if there's only one move, take it!
  if (possibleMoves.length === 1) {
    return possibleMoves[0];
  }

  // if no possible moves bring monster closer to hero
  // (trapped btw other entity and wall), then pick one move at random
  if (!possibleMoves.length) {
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

  // of those doors, choose the one that is closest to the hero
  const doorDistances = monsterRoomDoors.map(door =>
    Math.abs(door.coords[0] - hx) + Math.abs(door.coords[1] - hy));
  const indexOfClosestDoor = doorDistances.indexOf(Math.min(...doorDistances));
  const closestDoor = monsterRoomDoors[indexOfClosestDoor];
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

  // find cells to N,S,E, & W of monster's current position
  // that are valid move types (floor, door, hero, not next to another monster)
  const neighborCells = getPossibleMoves(entities, entityCoords);

  // is the entity right next to the hero? if so, that's the next move
  const heroCells = neighborCells.filter(cell => entities[cell[1]][cell[0]].type === 'hero');
  if (heroCells.length) {
    return move2Hero(neighborCells, entities);
  }

  // is the entity right next to another monstre? if so, move away to avoid
  // race conditions with the AI / monsters 'eating' each other in the grid
  const monsterCells = neighborCells.filter(cell => entities[cell[1]][cell[0]].type === 'monster' || entities[cell[1]][cell[0]].type === 'finalMonster');
  if (monsterCells.length) {
    return moveAwayFromMonster(neighborCells, monsterCells);
  }

  // is the entity in a doorway? if so, finish going through it
  if (entity.room === 'door') {
    return goThroughTheDoor(entityCoords, prevMoveChange, neighborCells);
  }

  // are monster and hero in different rooms? if so, look for the door
  // out of the monster's current room that brings him closest to hero
  if (entity.room !== heroRoom) {
    const bestDoor = getBestDoor(doors, entity.room, entityCoords, heroCoords);
    if (!bestDoor) {
      return chooseRandomMove(getPossibleMoves(entities, entityCoords),
        entities, entityCoords, true, prevMoveChange);
    }
    return moveTowardDoor(neighborCells, bestDoor, entities, entityCoords, prevMoveChange);
  }

  // if hero and monster are in same room, move toward hero
  return moveTowardHero(neighborCells, entityCoords, heroCoords, entities, prevMoveChange);
};

// render to canvas
// called from renderViewport()
const drawCell = (cellSize, ctx, cellInput, x, y, candle, key, levelCompleted,
  difficulty) => {
  const cell = { ...cellInput };
  if (!cell.level) { cell.level = 1; }
  if (!cell.hue) { cell.hue = 0; }
  const img = new Image();
  const radius = Math.floor((cellSize) * 0.2) || 2;
  const size = cellSize * 2;
  switch (cell.type) {
    case 'wall':
      ctx.clearRect(x, y, cellSize, cellSize);
      ctx.lineJoin = 'round';
      ctx.lineWidth = radius;
      ctx.strokeStyle = `hsl(${cell.hue}, ${100 - ((cell.level - 1) * 10)}%, ${(cell.opacity - (cell.level / 10)) * 100}%)`;
      ctx.strokeRect(x + (radius / 2), y + (radius / 2), cellSize - radius, cellSize - radius);
      ctx.fillStyle = `hsl(${cell.hue}, ${100 - ((cell.level - 1) * 10)}%, ${(cell.opacity - (cell.level / 10)) * 100}%)`; // rainbow
      ctx.fillRect(x + (radius / 2), y + (radius / 2), cellSize - radius, cellSize - radius);
      break;
    case 'padlock':
      // ctx.save();
      ctx.clearRect(x, y, cellSize, cellSize);
      ctx.lineJoin = 'round';
      ctx.lineWidth = radius;
      ctx.strokeStyle = `hsl(${cell.hue}, ${100 - ((cell.level - 1) * 10)}%, ${(cell.opacity - (cell.level / 10)) * 100}%)`;
      ctx.strokeRect(x + (radius / 2), y + (radius / 2), cellSize - radius, cellSize - radius);
      ctx.fillStyle = `hsl(${cell.hue}, ${100 - ((cell.level - 1) * 10)}%, ${(cell.opacity - (cell.level / 10)) * 100}%)`; // rainbow
      ctx.fillRect(x + (radius / 2), y + (radius / 2), cellSize - radius, cellSize - radius);
      img.src = cell.iconUrl;
      // img.onload = () => {
      ctx.drawImage(img, x, y, cellSize, cellSize);
        // ctx.restore();
      // };
      break;
    case 'floor':
    case 'door':
      ctx.fillStyle = `hsl(0, 0%, ${80 - ((cell.level - 1) * 15)}%)`;
      ctx.fillRect(x, y, cellSize, cellSize);
      break;
    case 'hero':
    case 'candle':
      img.src = cell.iconUrl;
      img.onload = () => {
        ctx.save();
        ctx.clearRect(x, y, cellSize, cellSize);
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'yellow';
        ctx.drawImage(img, x, y, cellSize, cellSize);
        ctx.restore();
      };
      break;
    case 'key':
      if (levelCompleted || difficulty < 2) {
        console.log('drawing key');
        img.src = cell.iconUrl;
        img.onload = () => {
          ctx.save();
          ctx.clearRect(x, y, cellSize, cellSize);
          ctx.shadowBlur = 20;
          ctx.shadowColor = 'yellow';
          ctx.drawImage(img, x, y, cellSize, cellSize);
          ctx.restore();
        };
      }
      break;
    case 'monster':
      img.src = cell.iconUrl;
      img.onload = () => {
        ctx.save();
        ctx.clearRect(x, y, cellSize, cellSize);
        ctx.drawImage(img, x, y, cellSize, cellSize);
        ctx.restore();
      };
      break;
    case 'food':
      img.src = cell.iconUrl;
      if (cell.title === 'Invisible Sufganiyah') {
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
          ctx.clearRect(x, y, cellSize, cellSize);
          ctx.drawImage(img, x, y, cellSize, cellSize);
          ctx.restore();
        };
      }
      break;
    case 'teamHero':
      img.src = cell.iconUrl;
      img.onload = () => {
        ctx.save();
        ctx.clearRect(x, y, cellSize, cellSize);
        ctx.drawImage(img, x, y, cellSize, cellSize);
        ctx.restore();
      };
      break;
    case 'finalMonster':
      if (cell.opacity) {
        img.src = cell.iconUrl;
        img.onload = () => {
          ctx.save();
          ctx.clearRect(x, y, (cellSize * 2), (cellSize * 2));
          ctx.drawImage(img, x, y, size, size);
          ctx.restore();
        };
      }
      break;
    case 'staircase':
      if (levelCompleted || difficulty < 2) {
        img.src = './img/staircase_32_c.png?raw=true';
        img.onload = () => {
          ctx.save();
          ctx.clearRect(x, y, cellSize, cellSize);
          ctx.drawImage(img, x, y, cellSize, cellSize);
          ctx.restore();
        };
      }
      break;
    default:
      ctx.fillStyle = 'hsla(270, 100%, 50%, 1)';
      ctx.fillRect(x, y, cellSize, cellSize);
  }
};

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// called from Board.jsx > draw()
export const renderViewport = (heroPosition, entities, cellSize,
  candle, key, levelCompleted, difficulty) => {
  const [hX, hY] = heroPosition;
  const newEntities = entities.map(row => row.map((cell) => {
    const newCell = { ...cell };
    return newCell;
  }));
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  // reset the transform matrix
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // clamp viewport position to grid bounds, center around hero
  const vX = clamp(((hX - (vSize / 2))), 0, ((gridWidth - vSize))); // 30
  const vY = clamp(((hY - (vSize / 2))), 0, ((gridHeight - vSize))); // 20
  // filter out rows above or below viewport,
  newEntities.filter((row, rIdx) => rIdx >= vY && rIdx < (vY + vSize)).map((r, i) =>
      // filter out cells to left or right of viewport
       r.filter((r2, i2) => i2 >= vX && i2 < (vX + vSize))
      .map((c, j) => {
        const x = cellSize * j;
        const y = cellSize * i;
        const newCell = { ...c };
        // only draw cells if they are DIFFERENT from last viewport update
        // if (!prevVP) {
        drawCell(cellSize, ctx, newCell, x, y, candle, key, levelCompleted, difficulty);
        return null;
        // }
        // const prevCell = prevVP[i][j];
        // if (newCell.type !== prevCell.type ||
        //   newCell.name !== prevCell.name ||
        //   newCell.opacity !== prevCell.opacity ||
        //   newCell.hue !== prevCell.hue) {
        //   drawCell(cellSize, ctx, newCell, x, y, candle, key, levelCompleted, difficulty);
        //   return newCell;
        // }
        // return newCell;
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

export const goodNews = ['Awesome', 'Sweet', 'Yee-hah', 'Hurrah', 'Yay', 'Nice', 'Jeepers', 'Golly', 'Hot diggity', 'Score', 'Whee', 'OMG', 'Woohoo', 'Willya look at that'];

export const badNews = ['Bummer', 'Raw deal', 'Dang', 'Crud', 'Uh oh', 'Crikey', 'Bad news', 'Crap on a cracker', 'Doggone it', 'Drat', 'Y i k e s', 'Oh dear', 'Welp', 'Too bad'];

export const shake = ['shake', 'shake-hard', 'shake-rotate', 'shake-crazy'];

export const hearts = (entity) => {
  let totalHealth;
  let healthNum;
  if (entity.type === 'hero') {
    const healthArray = [160, 280, 510];
    totalHealth = healthArray[entity.level - 1];
    healthNum = Math.floor((entity.hp / totalHealth) * 5) + 1;
    if (entity.hp === 0) { healthNum = 0; }
  } else if (entity.type === 'monster') {
    const healthArray = [70, 243, 515];
    totalHealth = healthArray[entity.level - 1];
    healthNum = Math.floor((entity.health / totalHealth) * 5) + 1;
    if (entity.health === 0) { healthNum = 0; }
  } else if (entity.type === 'finalMonster') {
    totalHealth = 500;
    healthNum = Math.floor((entity.health / totalHealth) * 5) + 1;
    if (entity.health === 0) { healthNum = 0; }
  }
  let heartsArr = [];
  if (healthNum > 0) {
    for (let i = 0; i < healthNum; i++) {
      heartsArr.push('0');
    }
  }
  if (heartsArr.length > 5) {
    heartsArr = [0, 0, 0, 0, 0];
  }
  if (!heartsArr.length) {
    heartsArr = [0];
  }
  return heartsArr;
};

export const trapFocus = () => {
  const firstAnchor = document.getElementById('first');
  const lastAnchor = document.getElementById('last');
  if (firstAnchor) {
    firstAnchor.focus();
  }

  const keydownHandler = (f) => {
    const evt = f || window.event;
    const keyCode = evt.which || evt.keyCode;
    if (keyCode === 9 && !evt.shiftKey) { // TAB
      if (evt.preventDefault) evt.preventDefault();
      else evt.returnValue = false;
      firstAnchor.focus();
    }
  };

  const keydownHandlerFirst = (f) => {
    const evt = f || window.event;
    const keyCode = evt.which || evt.keyCode;
    if (keyCode === 9 && evt.shiftKey) { // TAB+SHIFT
      if (evt.preventDefault) evt.preventDefault();
      else evt.returnValue = false;
      lastAnchor.focus();
    }
  };

  if (lastAnchor && lastAnchor.addEventListener) lastAnchor.addEventListener('keydown', keydownHandler, false);
  else if (lastAnchor && lastAnchor.attachEvent) lastAnchor.attachEvent('onkeydown', keydownHandler);
  if (firstAnchor && firstAnchor.addEventListener) firstAnchor.addEventListener('keydown', keydownHandlerFirst, false);
  else if (firstAnchor && firstAnchor.attachEvent) firstAnchor.attachEvent('onkeydown', keydownHandlerFirst);
};

export const checkForTouchScreens = () => {
  window.addEventListener('touchstart', function onFirstTouch() {
    document.body.classList.add('touchscreen');
    window.removeEventListener('touchstart', onFirstTouch, false);
  }, false);
};

export const preloadImage = (url, callback) => {
  const img = new Image();
  // console.log(`loaded: ${url}`);
  img.src = url;
  img.onload = callback;
};
