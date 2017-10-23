import * as utils from '../utils';
import foodTypes from './foodTypes';
import teamHeroes from './teamHeroes';
import monsterTypes from './monsterTypes';

const fillGrid = (gameMap, level, hero) => {
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

  const foods = [];
  const qF = foodTypes
 .filter(food => food.level === level);
  for (let i = 0; i < 4; i++) {
    const food = Object.assign({}, qF[i]);
    food.type = 'food';
    foods.push(food);
  }

  const teamHeroArray = [];
  const qH = teamHeroes
.filter(teamHero => teamHero.level === level && teamHero.name !== hero.name);
  for (let i = 0; i < 4; i++) {
    const teamHero = Object.assign({}, qH[i]);
    teamHero.type = 'teamHero';
    teamHeroArray.push(teamHero);
  }

// hard code hero in center of viewport
  const heroPosition = [utils.gridWidth / 2, utils.gridHeight / 2];
  const [hX, hY] = heroPosition;
  const newMap = gameMap.map(row => row.map((cell) => {
    const newCell = Object.assign({}, cell);
    return newCell;
  }));
  const newHero = hero;
  newHero.type = 'hero';
  newMap[hY][hX] = newHero;
  [foods, monsters, teamHeroArray, staircases, finalMonsters].forEach((entities) => {
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
