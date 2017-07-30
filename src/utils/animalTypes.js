// Hero start: 10

// Giraffe 1 5
// Penguin 1 5
// Lamb 1 5
// Frog 1 5
// TOTAL: 30

// Hippo 2 10
// Bear 2 10
// Kitty 2 10
// Octopus 2 10
// TOTAL: 70 * 1.5 = 135

// Lion 3 10
// Pig 3 10
// Panda 3 10
// Red Panda 3 20
// TOTAL: 166 * 2 = 332

const animalTypes = [
  {
    name: 'Giraffe',
    message: 'Baby Giraffe can chew off monster hair and ears',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/giraffe.svg',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/giraffe.svg',
    damage: 5,
    level: 1,
  },
  {
    name: 'Penguin',
    message: 'Baby Penguin can slap monsters with her flippers',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/penguin.svg',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/penguin.svg',
    damage: 5,
    level: 1,
  },
  {
    name: 'Lamb',
    message: 'Lamb can headbutt monsters and knock them over',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/lamb.svg',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/lamb.svg',
    damage: 5,
    level: 1,
  },
  {
    name: 'Froggie',
    message: 'Froggie can lash monsters with her long tongue',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/frog.svg',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/frog.svg',
    damage: 5,
    level: 1,
  },
  {
    name: 'Kitty',
    message: 'Kitty can scratch monsters with her sharp claws',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/kitty.svg',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/kitty.svg',
    damage: 10,
    level: 2,
  },
  {
    name: 'Hippo',
    message: 'Baby Hippo can roll over and squash monsters flat',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/hippo.svg',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/hippo.svg',
    damage: 10,
    level: 2,
  },
  {
    name: 'Octopus',
    message: 'Baby Octopus can strangle monsters with her tentacles',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/octopus.svg',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/octopus.svg',
    damage: 10,
    level: 2,
  },
  {
    name: 'Bear',
    message: 'Baby Bear can clobber monsters with her powerful paws',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/bear.svg',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/bear.svg',
    damage: 10,
    level: 2,
  },
  {
    name: 'Lion',
    message: 'Lion has a ferocious roar that frightens monsters away',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/lion.svg',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/lion.svg',
    damage: 10,
    level: 3,
  },
  {
    name: 'Piglet',
    message: 'Piglet has a powerful bite',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/pig.svg',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/pig.svg',
    damage: 10,
    level: 3,
  },

  {
    name: 'Panda',
    message: 'Baby Panda can hug monsters to death',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/panda.svg',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/panda.svg',
    damage: 10,
    level: 3,
  },
  {
    name: 'Red Panda',
    message: 'Red Panda is quick and smart, her claws and teeth are sharp',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/red-panda.svg',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/red-panda.svg',
    damage: 20,
    level: 3,
  },
];

export default animalTypes;
