import * as utils from '../utils';
import generateMap from './mapGen';

let torch = false;
let torchPower = 10;
let torchRadius = [];

export const toggleTorch = (bool) => {
	torch = bool;
	generateMap();

}

const fillGrid = (gameMap, level = 1) => {
	const finalMonsters = [];
	if (level === 3) {
		finalMonsters.push({
			health: 400,
			level: 5,
			type: 'finalMonster',
			name: 'Donald Trump',
			bio: '',
			youDiedMsg: '',
			iconUrl: '',
			damage: 60,
		});
	}

	const monsterTypes = [
		{
			name: 'The Propped Up Corpse of Ronald Reagan',
			bio: '',
			youDiedMsg: '',
			iconUrl: '',
			type: 'monster',
			damage: 15
		},
		{
			name: 'George W. Bush',
			bio: '',
			youDiedMsg: '',
			iconUrl: '',
			type: 'monster',
			damage: 15
		},
		{
			name: 'Dick Cheney',
			bio: '',
			youDiedMsg: '',
			iconUrl: '',
			type: 'monster',
			damage: 15
		},
		{
			name: 'Chris Christie',
			bio: '',
			youDiedMsg: '',
			iconUrl: '',
			type: 'monster',
			damage: 15
		},
		{
			name: 'Scott Walker',
			bio: '',
			youDiedMsg: '',
			iconUrl: '',
			type: 'monster',
			damage: 15
		},
		{
			name: 'Richard Nixon',
			bio: '',
			youDiedMsg: '',
			iconUrl: '',
			type: 'monster',
			damage: 15
		},
		{
			name: 'Rush Limbaugh',
			bio: '',
			youDiedMsg: '',
			iconUrl: '',
			type: 'monster',
			damage: 15
		},
		{
			name: 'Richard Spencer',
			bio: '',
			youDiedMsg: '',
			iconUrl: '',
			type: 'monster',
			damage: 15
		},
		{
			name: 'Pat Buchanan',
			bio: '',
			youDiedMsg: '',
			iconUrl: '',
			type: 'monster',
			damage: 15
		},
		{
			name: 'Orrin Hatch',
			bio: '',
			youDiedMsg: '',
			iconUrl: '',
			type: 'monster',
			damage: 21
		},
		{
			name: 'Jeff Flake',
			bio: '',
			youDiedMsg: '',
			iconUrl: '',
			type: 'monster',
			damage: 25
		},
		{
			name: 'Ted Cruz',
			bio: '',
			youDiedMsg: '',
			iconUrl: '',
			type: 'monster',
			damage: 31
		},
		{
			name: 'Mitch McConnell',
			bio: '',
			youDiedMsg: '',
			iconUrl: '',
			type: 'monster',
			damage: 37
		},
		{
			name: 'Steve Bannon',
			bio: '',
			youDiedMsg: '',
			iconUrl: '',
			type: 'monster',
			damage: 43
		}
	];

	const monsters = [];
	for (let i = 0; i < 7; i++) {
		monsters.push({
			health: level * 30 + 40,
			level: utils.randomInt(level, utils.randomInt(level - 1 ? level - 1 : level, level + 1)),
			type: 'monster'
		});
	}

	const staircases = [];
	if (level < 3) {
		staircases.push({
			type: 'staircase'
		});
	}

	const heroes = [
		{
			type: 'hero'
		}
	];

	const foods = [];
	for (let i = 0; i < 5; i++) {
		foods.push({ type: 'food' });
	}

	const foodTypes = [
		{
			name: 'Cherries',
			message: '',
			iconUrl: '',
			healthBoost: 14
		},
		{
			name: 'Strawberry',
			message: '',
			iconUrl: '',
			healthBoost: 14
		},
		{
			name: 'Apple',
			message: '',
			iconUrl: '',
			healthBoost: 19
		},
		{
			name: 'Kiwi',
			message: '',
			iconUrl: '',
			healthBoost: 14
		},
		{
			name: 'Watermelon',
			message: '',
			iconUrl: '',
			healthBoost: 26
		},
		{
			name: 'Grapes',
			message: '',
			iconUrl: '',
			healthBoost: 19
		},
		{
			name: 'Pear',
			message: '',
			iconUrl: '',
			healthBoost: 19
		},
		{
			name: 'Pineapple',
			message: '',
			iconUrl: '',
			healthBoost: 26
		},
		{
			name: 'Ice Cream Cone',
			message: '',
			iconUrl: '',
			healthBoost: 43
		},
		{
			name: 'Ice Cream Bar',
			message: '',
			iconUrl: '',
			healthBoost: 43
		},
		{
			name: 'Hamburger',
			message: '',
			iconUrl: '',
			healthBoost: 50
		},
		{
			name: 'Pizza',
			message: '',
			iconUrl: '',
			healthBoost: 50
		},
		{
			name: 'Donut',
			message: '',
			iconUrl: '',
			healthBoost: 43
		}
	];

	const animalTypes = [
		{
			name: 'Baby Giraffe',
			message: '',
			iconUrl: '',
			damage: 19
		},
		{
			name: 'Baby Penguin',
			message: '',
			iconUrl: '',
			damage: 26
		},
		{
			name: 'Kitty',
			message: '',
			iconUrl: '',
			damage: 33
		},
		{
			name: 'Baby Fox',
			message: '',
			iconUrl: '../img/baby-fox.gif',
			damage: 40
		},
		{
			name: 'Baby Elephant',
			message: '',
			iconUrl: '',
			damage: 43
		},
		{
			name: 'Baby Hippo',
			message: '',
			iconUrl: '../img/baby-hippo.gif',
			damage: 19
		},
		{
			name: 'Duckling',
			message: '',
			iconUrl: '',
			damage: 26
		},
		{
			name: 'Froggie',
			message: '',
			iconUrl: '../img/frog.gif',
			damage: 33
		},
		{
			name: 'Baby Octopus',
			message: '',
			iconUrl: '../img/octopus.gif',
			damage: 40
		},
		{
			name: 'Baby Snake',
			message: '',
			iconUrl: '',
			damage: 43
		},
		{
			name: 'Baby Turtle',
			message: '',
			iconUrl: '',
			damage: 33
		},
		{
			name: 'Baby Whale',
			message: '',
			iconUrl: '',
			damage: 40
		},
		{
			name: 'Devil Kitty',
			message: '',
			iconUrl: '',
			damage: 43
		}
	];

	const animals = [];
	// animal types will vary based on the level passed to the parent function
	const qualifying = animalTypes
		.filter(animal => animal.damage < level * 20 + 10)
			.filter(animal => animal.damage > level * 20 - 10);
	for (let i = 0; i < 8; i++) {
		const animal = Object.assign({}, qualifying[utils.randomInt(0, qualifying.length - 1)]);
		animal.type = 'animal';
		console.log(animal, animals);
		animals.push(animal);
	}

	// 2. randomly place all the entities on to floor cells on the game map.

	let heroPosition = [];
	[foods, monsters, animals, staircases, heroes, finalMonsters].forEach(entities => {
		while (entities.length) {
			const x = Math.floor(Math.random() * utils.gridWidth);
			const y = Math.floor(Math.random() * utils.gridHeight);
			if (gameMap[y][x].type === 'floor') {
				if (entities[0].type === 'hero') {
					heroPosition = [x, y];
				}
				gameMap[y][x] = entities.pop();
			}
		}
	});

	// narrow visibility (turned off temporarily; set torch to true to turn on)
//   const [ heroX, heroY ] = heroPosition;
//   console.log(torch);
//   if (torch) {
// 	gameMap.map((row, i) => row.map((cell, j) => {
// 		if (Math.sqrt((j-heroX)*(j-heroX) + (i-heroY)*(i-heroY)) < torchPower)
// 		{ cell.torch = 1 } else { cell.torch = 0};
// 		return cell;
// 	}));
// } else {
// 	return null;
// }


	// render to canvas
	utils.drawCells(gameMap);


	return {gameMap, heroPosition};

};

export default fillGrid;