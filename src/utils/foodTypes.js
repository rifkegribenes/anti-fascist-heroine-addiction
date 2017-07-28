// Hero health start: 100

// Cherry 1 15
// Strawberry 1 15
// Apple 1 15
// Kiwi 1 15
// Total health possible: 60 (160 total)
// total damage range (@2-3 hits each): 120-180

// Watermelon 2 30
// Grapes 2 30
// Pear 2 30
// Pineapple 2 30
// Total health possible: 120 (280 total)
// total damage range (@1-2 hits each): 120-180 (240-360 total)

// Ice cream 3 50
// Popsicle 3 50
// Hamburger 3 50
// Donut 3 80
// Total health possible: 230 (510 total)
// // total damage range (@1-2 hits each): 185-370 (425-730 total not incl final monster)


const foodTypes = [
  {
    name: 'a Cherry',
    title: 'Cherries',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/cherries.gif',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/cherries_200.gif',
    healthBoost: 15,
    level: 1,
  },
  {
    name: 'a Strawberry',
    title: 'Strawberry',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/strawberry.gif',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/strawberry_200.gif',
    healthBoost: 15,
    level: 1,
  },
  {
    name: 'an Apple',
    title: 'Apple',
    iconUrl: '',
    healthBoost: 15,
    level: 1,
  },
  {
    name: 'a Kiwi',
    title: 'Kiwi',
    iconUrl: '',
    healthBoost: 15,
    level: 1,
  },
  {
    name: 'a Watermelon',
    title: 'Watermelon',
    iconUrl: '',
    healthBoost: 30,
    level: 2,
  },
  {
    name: 'a bunch of Grapes',
    title: 'Grapes',
    iconUrl: '',
    healthBoost: 30,
    level: 2,
  },
  {
    name: 'a Pear',
    title: 'Pear',
    iconUrl: '',
    healthBoost: 30,
    level: 2,
  },
  {
    name: 'a Pineapple',
    title: 'Pineapple',
    iconUrl: '',
    healthBoost: 30,
    level: 2,
  },
  {
    name: 'an Ice Cream Cone',
    title: 'Ice Cream Cone',
    message: '',
    iconUrl: '',
    healthBoost: 50,
    level: 3,
  },
  {
    name: 'a Popsicle',
    title: 'Popsicle',
    iconUrl: '',
    healthBoost: 50,
    level: 3,
  },
  {
    name: 'a Hamburger',
    title: 'Hamburger',
    iconUrl: '',
    healthBoost: 50,
    level: 3,
  },
  {
    name: 'a Donut',
    title: 'Donut',
    iconUrl: '',
    healthBoost: 80,
    level: 3,
  },
];

export default foodTypes;
