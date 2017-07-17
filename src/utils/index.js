export const cellSize = 30;
export const gridHeight = 40;
export const gridWidth = 40;
const maxRooms = 15;
const roomSizeRange = [7, 12];
// export const gridHeight = 20;
// export const gridWidth = 20;
// const maxRooms = 5;
// const roomSizeRange = [3, 6];
const initialGrid = [];
let currentGrid = [];

// 0 = wall, 1 = floor, 2 = door

// helper functions
const random = (min, max) => (Math.random() * (max - min)) + min;
const randomInt = (min, max) => Math.floor(random(min, max));

const drawCell = (x, y, cellType, id, idx, startIdx) => {
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  if (idx === startIdx ) {
    ctx.font = "10px Arial";
    ctx.fillText(`${crToI(x/30,y/30)}`,x,y);
  } else {
    switch (cellType) {
      case 0: // wall
        ctx.fillStyle = `rgba(0, 255, 0, ${random(0.3, 0.8)})`;
        // ctx.fillStyle = 'pink';
        break;
      case 1: // floor
        // console.log(`drawing cell ${id}`);
        switch (id) {
          case 'O':
            ctx.fillStyle = 'black';
            break;
          case 'N':
            ctx.fillStyle = 'blue';
            break;
          case 'E':
            ctx.flllStyle = 'brown';
            break;
          case 'S':
            ctx.fillStyle = 'purple';
            break;
          case 'W':
            ctx.fillSTyle = 'yellow';
            break;
          default:
            ctx.fillStyle = 'orange';
            break;
          }
        break;

      case 2: // door
        ctx.fillStyle = 'red';
        break;
      default:
        ctx.fillStyle = 'gray';
    }
    ctx.fillRect(x, y, cellSize, cellSize);
  }
};

const drawCells = (arr, id, startIdx) => {
  // console.log(id);
  arr.forEach((cell, idx) => {
    const x = cellSize * (idx % gridWidth);
    const y = cellSize * (Math.floor(idx / gridWidth));
     const cellType = arr[idx];
    if (cell !== 'x') {
      drawCell(x, y, cellType, id, idx, startIdx);
    }
  });
};

const nextDraw = (nextCells, id, startIdx) => {
  const currentBoard = currentGrid;
  const changed = nextCells.map((cell, i) => {
    if (cell !== currentBoard[i]) {
      return cell;
    }
    return 'x';
  });
  drawCells(changed, id, startIdx);
};

// const xyToIdx = (x, y) => {
//   const c = Math.floor(x / cellSize);
//   const r = Math.floor(y / cellSize);
//   return c + (r * gridWidth);
// };

// const idxToCR = (i) => {
//   const c = i % gridWidth;
//   const r = Math.floor(i / gridWidth);
//   return [c, r];
// };

const crToI = (c, r) => c + (r * gridWidth);

// given a columnn and row, adjust for wrapping to other side of board and return index
// const crAdjToI = (c, r) => {
//   let adjC = c;
//   let adjR = r;
//   if (c === -1) { adjC = gridWidth - 1; }
//   if (r === -1) { adjR = gridHeight - 1; }
//   if (c === gridWidth) { adjC = 0; }
//   if (r === gridHeight) { adjR = 0; }
//   return adjC + (adjR * gridWidth);
// };

const isValidRoomPlacement = (grid, { x, y, width = 1, height = 1 }) => {
  const startIdx = crToI(x - 1, y - 1);
  console.log(`startIndex of proposed room =${startIdx}`);
  // check if on the edge of or outside of the grid
  if (y < 1 || y + height > gridHeight - 1) {
    console.log('proposed room is too close to edge');
    return false;
  }
  if (x < 1 || x + width > gridWidth - 1) {
    console.log('proposed room is too close to edge');
    return false;
  }

  // check from x-1,y-1 to y+height+1, x+width+1 and check if they are any floors
  for (let i = 0; i <= height; i++) {
    // for each room row, starting at first index in row
    for (let j = 0; j <= width; j++) { // check cells in row for floor type
      const checkIdx = startIdx + i + (j * gridWidth);
      if (grid[checkIdx] === 1) {
        console.log('proposed room is too close to existing room');
        return false;
      }
    }
  }

  // all grid cells are clear
  return true;
};

export const generateMap = () => {
// generate empty grid
  for (let i = 0; i < (gridHeight * gridWidth); i++) {
    initialGrid.push(0);
  }
  drawCells(initialGrid);
  currentGrid = initialGrid;

// create first room
  const [min, max] = roomSizeRange;
  const firstRoom = {
    x: randomInt(1, (gridWidth - max - 1)),
    y: randomInt(1, (gridHeight - max - 1)),
    height: randomInt(min, max),
    width: randomInt(min, max),
    id: 'O',
  };

// draw room
  const placeRoom = (oldGrid, { x, y, width = 1, height = 1, id }) => {
    const newGrid = [...oldGrid];
    const startIdx = crToI(x, y);
    // console.log(`Room ${id} startIndex = ${startIdx}`);
    // console.log(`Room ${id} width=${width}, height=${height}`);
    for (let i = 0; i < height; i++) {
    // for each room row, starting at first index in row
      for (let j = 0; j < width; j++) { // fill cells in row
        const fillIdx = startIdx + i + (j * gridWidth);
        newGrid[fillIdx] = 1;
      }
    }
    nextDraw(newGrid, id, startIdx);
    return newGrid;
  };

  const nextGrid = placeRoom(initialGrid, firstRoom);
  // drawCells(nextGrid);
  currentGrid = nextGrid;

  const createRoomsFromSeed = (oldGrid, { x, y, width, height }) => {
    const roomValues = [];
    const north = { height: randomInt(min, max), width: randomInt(min, max) };
    let newGrid = [];
    north.x = randomInt(x, x + (width - 1));
    north.y = y - north.height - 1;
    north.doorx = randomInt(north.x, (Math.min(north.x + north.width, x + width)) - 1);
    north.doory = y - 1;
    north.id = 'N';
    roomValues.push(north);

    const east = { height: randomInt(min, max), width: randomInt(min, max) };
    east.x = x + width + 1;
    east.y = randomInt(y, height + (y - 1));
    east.doorx = east.x - 1;
    east.doory = randomInt(east.y, (Math.min(east.y + east.height, y + height)) - 1);
    east.id = 'E';
    roomValues.push(east);

    const south = { height: randomInt(min, max), width: randomInt(min, max) };
    south.x = randomInt(x, width + (x - 1));
    south.y = y + height + 1;
    south.doorx = randomInt(south.x, (Math.min(south.x + south.width, x + width)) - 1);
    south.doory = y + height;
    south.id = 'S';
    roomValues.push(south);

    const west = { height: randomInt(min, max), width: randomInt(min, max) };
    west.x = x - west.width - 1;
    west.y = randomInt(y, height + (y - 1));
    west.doorx = x - 1;
    west.doory = randomInt(west.y, (Math.min(west.y + west.height, y + height)) - 1);
    west.id = 'W';
    roomValues.push(west);

    const placedRooms = [];
    roomValues.forEach((room) => {
      if (isValidRoomPlacement(currentGrid, room)) {
        console.log(`room ${room.id} is valid`);
        // place room
        newGrid = placeRoom(currentGrid, room);
        // console.log(`added room ${room.id}`, newGrid);
        // place door
        newGrid = placeRoom(currentGrid, { x: room.doorx, y: room.doory, id: 'D' }, 2);
        // console.log(`added door for room ${room.id}`, newGrid);
        // need placed room values for the next seeds
        placedRooms.push(room);
        currentGrid = newGrid;
        // console.log(`added completed room ${room.id} to placedRooms:`, placedRooms);
        nextDraw(currentGrid);
      } else {
        console.log(`room ${room.id} is NOT VALID`);
      }
    });
    // console.log('/////////////////ROOM VALUES////////////////', roomValues[0], roomValues[1], roomValues[2], roomValues[3]);
    // console.log('does currentGrid reflect board? ', currentGrid);
    // nextDraw(newGrid);

    // const nextGrid = placeRoom(initialGrid, placedRooms[0]);
    // nextDraw(nextGrid);
    // currentGrid = nextGrid;

    return { newGrid, placedRooms };
  };

// using the first room as a seed, recursivley add rooms to the grid
  const growMap = (inputGrid, seedRooms) => {
    let counter = 1;
    if (counter + seedRooms.length > maxRooms || !seedRooms.length) {
      return inputGrid;
    }

// grid will be an obj that has an grid property and placedRooms property
    const newGrid = createRoomsFromSeed(inputGrid, seedRooms.pop());
    seedRooms.push(...newGrid.placedRooms);
    counter += newGrid.placedRooms.length;
    return growMap(newGrid.grid, seedRooms, counter);
  };

  const newGrid = growMap(currentGrid, [firstRoom]);
  // console.log(currentGrid);
  // nextDraw(newGrid);
};
