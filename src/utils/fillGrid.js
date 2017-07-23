import * as utils from '../utils';
import foodTypes from './foodTypes';
import animalTypes from './animalTypes';
import monsterTypes from './monsterTypes';

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

  const monsters = [];
  const qM = monsterTypes
.filter(monster => monster.damage < (level * 20) + 20)
.filter(monster => monster.damage > (level * 20) - 20);
  for (let i = 0; i < 8; i++) {
    const monster = Object.assign({}, qM[utils.randomInt(0, qM.length - 1)]);
    monster.type = 'monster';
    monster.health = (level * 30) + 40;
    monster.level = utils.randomInt(
    level, utils.randomInt(level - 1 ? level - 1 : level, level + 1),
    );
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
 .filter(food => food.healthBoost < (level * 20) + 20)
.filter(food => food.healthBoost > (level * 20) - 20);
  for (let i = 0; i < 5; i++) {
    const food = Object.assign({}, qF[utils.randomInt(0, qF.length - 1)]);
    food.type = 'food';
    foods.push(food);
  }

  const animals = [];
  const qA = animalTypes
.filter(animal => animal.damage < (level * 20) + 20)
.filter(animal => animal.damage > (level * 20) - 20);
  for (let i = 0; i < 8; i++) {
    const animal = Object.assign({}, qA[utils.randomInt(0, qA.length - 1)]);
    animal.type = 'animal';
    animals.push(animal);
  }

// hard code hero in center of viewport
  const heroPosition = [utils.gridWidth / 2, utils.gridHeight / 2];
  const [hX, hY] = heroPosition;
  const newMap = gameMap;
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
