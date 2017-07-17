// settings
export const cellSize = 30;
export const gridHeight = 60;
export const gridWidth = 80;
const maxRooms = 25;
const roomSizeRange = [4, 18];

export const generateMap = () => {

	const random = (min, max) => (Math.random() * (max - min)) + min;
	const randomInt = (min, max) => Math.floor(random(min, max));

	const isValid = (grid, {x, y, width = 1, height = 1}) => {
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
				if (grid[i][j] === 1) {
					return false;
				}
			}
		}
		// all grid cells are clear
		return true;
	};

	const placeCells = (grid, {x, y, width = 1, height = 1, id}, type = 1) => {
		for (let i = y; i < y + height; i++) {
			for (let j = x; j < x + width; j++) {
				grid[i][j] = type;
			}
		}
		return grid;
	};

	const createRoomsFromSeed = (grid, {x, y, width, height}, range = roomSizeRange) => {
		// range for generating the random room heights and widths
		const [min, max] = range;

		// generate room values for each edge of the seed room
		const roomValues = [];

		const north = { height: randomInt(min, max), width: randomInt(min, max) };
		north.x = randomInt(x, x + width - 1);
		north.y = y - north.height - 1;
		north.doorx = randomInt(north.x, (Math.min(north.x + north.width, x + width)) - 1);
		north.doory = y - 1;
		roomValues.push(north);

		const east = { height: randomInt(min, max), width: randomInt(min, max) };
		east.x = x + width + 1;
		east.y = randomInt(y, height + y - 1);
		east.doorx = east.x - 1;
		east.doory = randomInt(east.y, (Math.min(east.y + east.height, y + height)) - 1);
		roomValues.push(east);

		const south = { height: randomInt(min, max), width: randomInt(min, max) };
		south.x = randomInt(x, width + x - 1);
		south.y = y + height + 1;
		south.doorx = randomInt(south.x, (Math.min(south.x + south.width, x + width)) - 1);
		south.doory = y + height;
		roomValues.push(south);

		const west = { height: randomInt(min, max), width: randomInt(min, max) };
		west.x = x - west.width - 1;
		west.y = randomInt(y, height + y - 1);
		west.doorx = x - 1;
		west.doory = randomInt(west.y, (Math.min(west.y + west.height, y + height)) - 1);
		roomValues.push(west);

		const placedRooms = [];
		roomValues.forEach(room => {
			if (isValid(grid, room)) {
				grid = placeCells(grid, room);
				grid = placeCells(grid, {x: room.doorx, y: room.doory}, 2);
				placedRooms.push(room);
			}
		});
		return {grid, placedRooms};
	};

	// generate walls
	let grid = [];
	for (let i = 0; i < gridHeight; i++) {
		grid.push([]);
		for (let j = 0; j < gridWidth; j++) {
			grid[i].push(0);
		}
	}

	// first room
	const [min, max] = roomSizeRange;
	const firstRoom = {
		x: randomInt(1, gridWidth - max - 15),
		y: randomInt(1, gridHeight - max - 15),
		height: randomInt(min, max),
		width: randomInt(min, max)
	};

	grid = placeCells(grid, firstRoom);

	// add other rooms
	const growMap = (grid, seedRooms, counter = 1, maxRooms = maxRooms) => {
		if (counter + seedRooms.length > maxRooms || !seedRooms.length) {
			return grid;
		}

		grid = createRoomsFromSeed(grid, seedRooms.pop());
		seedRooms.push(...grid.placedRooms);
		counter += grid.placedRooms.length;
		return growMap(grid.grid, seedRooms, counter);
	};
	const grid2render = growMap(grid, [firstRoom]);

	// render to canvas
	const drawCell = (x, y, cellType) => {
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  const opacity = random(0.3, 0.8);
  switch (cellType) {
    case 0: // wall
      ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
      break;
    case 1: // floor
      ctx.fillStyle = 'black';
      break;
    case 2: // door
      ctx.fillStyle = 'black';
      break;
    default:
      ctx.fillStyle = 'blue';
  }
  ctx.fillRect(x, y, cellSize, cellSize);
};

	const drawCells = (arr) => {
  arr.forEach((row, rowIdx) => {
  	row.forEach((cell, cellIdx) => {
  		const x = cellSize * cellIdx;
    	const y = cellSize * rowIdx;
    	if (cell !== 'x') {
      drawCell(x, y, cell);
    }
  });
})
};

drawCells(grid2render);

};