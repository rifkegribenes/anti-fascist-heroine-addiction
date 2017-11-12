import { gridHeight, gridWidth, randomInt, random } from './index';

// const maxRooms = 15;
const roomSizeRange = [7, 12];

const generateMap = (level) => {
  const isValid = (grid, { x, y, width = 1, height = 1 }) => {
    // check if on edge of or outside of grid
    if (y < 1 || y + height > grid.length - 1) {
      return false;
    }
    if (x < 1 || x + width > grid[0].length - 1) {
      return false;
    }

    // check if on or adjacent to existing room
    for (let i = y - 1; i < y + height + 1; i++) {
      for (let j = x - 1; j < x + width + 1; j++) {
        if (grid[i][j].type === 'floor') {
          return false;
        }
      }
    }
    // all grid cells are clear
    return true;
  };

  const placeCells = (grid, { x, y, width = 1, height = 1, id }, type = 'floor') => {
    const grid2 = grid;
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        grid2[i][j] = { type, id };
      }
    }
    return grid2;
  };

  const createRooms = (grid, { x, y, width, height }, range = roomSizeRange) => {
    const [min, max] = range;
    const roomValues = [];

    const N = { height: randomInt(min, max), width: randomInt(min, max) };
    N.x = randomInt(x, (x + width) - 1);
    N.y = (y - N.height) - 1;
    N.dx = randomInt(N.x, (Math.min(N.x + N.width, x + width)) - 1);
    N.dy = y - 1;
    N.id = randomInt(0, 1000);
    roomValues.push(N);

    const E = { height: randomInt(min, max), width: randomInt(min, max) };
    E.x = (x + width) + 1;
    E.y = randomInt(y, (height + y) - 1);
    E.dx = E.x - 1;
    E.dy = randomInt(E.y, (Math.min(E.y + E.height, y + height)) - 1);
    E.id = randomInt(0, 1000);
    roomValues.push(E);

    const S = { height: randomInt(min, max), width: randomInt(min, max) };
    S.x = randomInt(x, (width + x) - 1);
    S.y = (y + height) + 1;
    S.dx = randomInt(S.x, (Math.min(S.x + S.width, x + width)) - 1);
    S.dy = y + height;
    S.id = randomInt(0, 1000);
    roomValues.push(S);

    const W = { height: randomInt(min, max), width: randomInt(min, max) };
    W.x = (x - W.width) - 1;
    W.y = randomInt(y, (height + y) - 1);
    W.dx = x - 1;
    W.dy = randomInt(W.y, (Math.min(W.y + W.height, y + height)) - 1);
    S.id = randomInt(0, 1000);
    roomValues.push(W);

    const placedRooms = [];
    const doors = [];
    roomValues.forEach((room) => {
      if (isValid(grid, room)) {
        placeCells(grid, room);
        // these are doors but use the same cell color as floors
        placeCells(grid, { x: room.dx, y: room.dy }, 'door');
        placedRooms.push(room);
      }
    });
    return { grid, placedRooms, doors };
  };

  // generate walls
  let newGrid = []; // at end of this function, newGrid = a 2d array of walls
  for (let i = 0; i < gridHeight; i++) {
    newGrid.push([]);
    for (let j = 0; j < gridWidth; j++) {
      newGrid[i].push({
        type: 'wall',
        opacity: random(0.4, 0.8),
        level,
        hue: (((i + j) * 7) % 360),
      });
    }
  }

  // hard code first room
  const [min, max] = roomSizeRange;
  const firstRoom = {
    x: (gridWidth / 2) - Math.floor(max / 2),  // center of grid
    y: (gridHeight / 2) - Math.floor(min / 2), // center of grid
    height: min,
    width: max,
    id: 0,
  };

  // console.log(firstRoom);

  newGrid = placeCells(newGrid, firstRoom);
  // now newGrid = 2d array of mostly walls plus a single room

  // add other rooms
  const growMap = (grid, seedRooms, counter = 1, maxRooms = 15) => {
    const grid4 = grid;
    let counter2 = counter;
    if (counter2 + seedRooms.length > maxRooms || !seedRooms.length) {
      return grid4;
    }

    const grid5 = createRooms(grid4, seedRooms.pop());
    seedRooms.push(...grid5.placedRooms);
    counter2 += grid5.placedRooms.length;
    return growMap(grid5.grid, seedRooms, counter2);
  };

  return growMap(newGrid, [firstRoom]);
  // with newGrid as input, recursively add more rooms using firstRoom as seed.
  // this function returns an empty dungeon level with walls, floors, and doors placed randomly.
};

export default generateMap;
