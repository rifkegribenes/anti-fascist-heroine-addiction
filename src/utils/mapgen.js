import { gridHeight, gridWidth, randomInt, drawCells } from './index';
import fillGrid from './fillGrid';

const maxRooms = 15;
const roomSizeRange = [7, 12];

const generateMap = () => {

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
				if (grid[i][j].type === 'floor') {
					return false;
				}
			}
		}
		// all grid cells are clear
		return true;
	};

	const placeCells = (grid, {x, y, width = 1, height = 1, id}, type = 'floor') => {
		for (let i = y; i < y + height; i++) {
			for (let j = x; j < x + width; j++) {
				grid[i][j] = { type };
			}
		}
		return grid;
	};

	const createRooms = (grid, {x, y, width, height}, range = roomSizeRange) => {
		const [min, max] = range;

		// generate room values for each edge of the seed room
		const roomValues = [];

		const N = { height: randomInt(min, max), width: randomInt(min, max) };
		N.x = randomInt(x, x + width - 1);
		N.y = y - N.height - 1;
		N.dx = randomInt(N.x, (Math.min(N.x + N.width, x + width)) - 1);
		N.dy = y - 1;
		roomValues.push(N);

		const E = { height: randomInt(min, max), width: randomInt(min, max) };
		E.x = x + width + 1;
		E.y = randomInt(y, height + y - 1);
		E.dx = E.x - 1;
		E.dy = randomInt(E.y, (Math.min(E.y + E.height, y + height)) - 1);
		roomValues.push(E);

		const S = { height: randomInt(min, max), width: randomInt(min, max) };
		S.x = randomInt(x, width + x - 1);
		S.y = y + height + 1;
		S.dx = randomInt(S.x, (Math.min(S.x + S.width, x + width)) - 1);
		S.dy = y + height;
		roomValues.push(S);

		const W = { height: randomInt(min, max), width: randomInt(min, max) };
		W.x = x - W.width - 1;
		W.y = randomInt(y, height + y - 1);
		W.dx = x - 1;
		W.dy = randomInt(W.y, (Math.min(W.y + W.height, y + height)) - 1);
		roomValues.push(W);

		const placedRooms = [];
		roomValues.forEach(room => {
			if (isValid(grid, room)) {
				grid = placeCells(grid, room);
				// these are doors but use the same cell color as floors
				grid = placeCells(grid, {x: room.dx, y: room.dy}, 'floor');
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
			grid[i].push({ type: 'wall' });
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

		grid = createRooms(grid, seedRooms.pop());
		seedRooms.push(...grid.placedRooms);
		counter += grid.placedRooms.length;
		return growMap(grid.grid, seedRooms, counter);
	};
	const initialGrid = growMap(grid, [firstRoom]);



drawCells(initialGrid);
fillGrid(initialGrid);

};

export default generateMap;