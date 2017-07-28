import * as utils from '../utils';
import foodTypes from './foodTypes';
import animalTypes from './animalTypes';
import monsterTypes from './monsterTypes';

const fillGrid = (gameMap, level) => {
  console.log(`filling grid for level ${level}`);
  const finalMonsters = [];
  if (level === 3) {
    finalMonsters.push({
      health: 500,
      level: 5,
      type: 'finalMonster',
      name: 'Donald Trump',
      bio: '',
      youDiedMsg: '',
      iconUrl: '',
      damage: 60,
    });
  }

  const monsters = [];
  const qM = monsterTypes
.filter(monster => monster.level === level);
  for (let i = 0; i < 4; i++) {
    const monster = Object.assign({}, qM[i]);
    monster.type = 'monster';
    monster.health = Math.floor(((level * 0.75) ** 2) * 90)
    + utils.randomInt(10 * level, 20 * level);
    monsters.push(monster);
  }

  const staircases = [];
  if (level < 3) {
    staircases.push({
      type: 'staircase',
    });
  }

  const heroes = [
    {
      type: 'hero',
    },
  ];

  const foods = [];
  const qF = foodTypes
 .filter(food => food.healthBoost < (level * 10) + 10)
.filter(food => food.healthBoost > (level * 10) - 10);
  for (let i = 0; i < 5; i++) {
    const food = Object.assign({}, qF[i]);
    food.type = 'food';
    foods.push(food);
  }

  const animals = [];
  const qA = animalTypes
.filter(animal => animal.level === level);
  for (let i = 0; i < 4; i++) {
    const animal = Object.assign({}, qA[i]);
    animal.type = 'animal';
    animals.push(animal);
  }

// hard code hero in center of viewport
  const heroPosition = [utils.gridWidth / 2, utils.gridHeight / 2];
  const [hX, hY] = heroPosition;
  const newMap = gameMap.map(row => row.map((cell) => {
    const newCell = Object.assign({}, cell);
    return newCell;
  }));
  newMap[hY][hX] = heroes[0]; // change this when add skins to choose from
  [foods, monsters, animals, staircases, finalMonsters].forEach((entities) => {
    while (entities.length) {
      const x = Math.floor(Math.random() * utils.gridWidth);
      const y = Math.floor(Math.random() * utils.gridHeight);
      if (newMap[y][x].type === 'floor') {
        newMap[y][x] = entities.pop();
      }
    }
  });
  return { newMap, heroPosition };
};

export default fillGrid;
