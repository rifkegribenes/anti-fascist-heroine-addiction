import * as utils from '../utils';
import foodTypes from './foodTypes';
import teamHeroes from './teamHeroes';
import monsterTypes from './monsterTypes';

const fillGrid = (gameMap, level, hero) => {
  // const finalMonsters = [];
  const tempHero = { ...hero };

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
      cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/staircase_200.png',
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
.filter(teamHero =>
  teamHero.level === level
  && (teamHero.name !== tempHero.name),
);
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

// hard code final boss in upper left four floor tiles on level 3
  // if (level === 3) {
  const finalMonster = {
    // health: 500,
    // level: 5,
    // damage: 60,
    health: 100,
    level: 1,
    damage: 10,
    type: 'finalMonster',
    name: 'Donald Trump',
    bio: '',
    youDiedMsg: '',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/donald-trump_64.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/donald-trump_200.png',
    opacity: 1,
  };

    // find most upper-left floor tile
  let topLeft = [];
  for (let i = 0; i < newMap.length; i++) {
    for (let j = 0; j < newMap[i].length; j++) {
      if (newMap[i][j].type === 'floor') {
        topLeft = [j, i]; // x,y
        break;
      }
    } if (topLeft.length > 0) {
      break;
    }
  }

  // Save an array of the coordinates of the four blocks
  // that the final monster will fill

  const trumpPosition = [
    [topLeft[1], topLeft[0]],
    [topLeft[1] + 1, topLeft[0]],
    [topLeft[1] + 1, topLeft[0] + 1],
    [topLeft[1], topLeft[0] + 1],
  ];


  // Fill four-tile block in top-left positionwith fM object,
  // but only draw it once
  newMap[topLeft[1]][topLeft[0]] = finalMonster;

  // fill the other three tiles in the block with the smame object
  // but don't draw it to the canvas
  const fmInv = { ...finalMonster };

  fmInv.opacity = 0;
  newMap[topLeft[1] + 1][topLeft[0]] = fmInv;
  newMap[topLeft[1] + 1][topLeft[0] + 1] = fmInv;
  newMap[topLeft[1]][topLeft[0] + 1] = fmInv;

  // randomly place other entities on floor tiles throughout grid
  [foods, monsters, teamHeroArray, staircases].forEach((entities) => {
    while (entities.length) {
      const x = Math.floor(Math.random() * utils.gridWidth);
      const y = Math.floor(Math.random() * utils.gridHeight);
      if (newMap[y][x].type === 'floor') {
        newMap[y][x] = entities.pop();
      }
    }
  });
  return { newMap, heroPosition, trumpPosition };
};

export default fillGrid;
