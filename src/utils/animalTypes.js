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
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/giraffe_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/giraffe.png',
    damage: 5,
    level: 1,
  },
  {
    name: 'Penguin',
    message: 'Baby Penguin can slap monsters with her flippers',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/penguin_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/penguin.png',
    damage: 5,
    level: 1,
  },
  {
    name: 'Lamb',
    message: 'Lamb can headbutt monsters and knock them over',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/lamb_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/lamb.png',
    damage: 5,
    level: 1,
  },
  {
    name: 'Froggie',
    message: 'Froggie can lash monsters with her long tongue',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/frog_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/frog.png',
    damage: 5,
    level: 1,
  },
  {
    name: 'Kitty',
    message: 'Kitty can scratch monsters with her sharp claws',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/kitty_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/kitty.png',
    damage: 10,
    level: 2,
  },
  {
    name: 'Hippo',
    message: 'Baby Hippo can roll over and squash monsters flat',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/hippo_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/hippo.png',
    damage: 10,
    level: 2,
  },
  {
    name: 'Octopus',
    message: 'Baby Octopus can strangle monsters with her tentacles',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/octopus_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/octopus.png',
    damage: 10,
    level: 2,
  },
  {
    name: 'Bear',
    message: 'Baby Bear can clobber monsters with her powerful paws',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/bear_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/bear.png',
    damage: 10,
    level: 2,
  },
  {
    name: 'Lion',
    message: 'Lion has a ferocious roar that frightens monsters away',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/lion_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/lion.png',
    damage: 10,
    level: 3,
  },
  {
    name: 'Piglet',
    message: 'Piglet has a powerful bite',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/pig_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/pig.png',
    damage: 10,
    level: 3,
  },

  {
    name: 'Panda',
    message: 'Baby Panda can hug monsters to death',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/panda_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/panda.png',
    damage: 10,
    level: 3,
  },
  {
    name: 'Red Panda',
    message: 'Red Panda is quick and smart, her claws and teeth are sharp',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/red-panda_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/red-panda.png',
    damage: 20,
    level: 3,
  },
];

export default animalTypes;
