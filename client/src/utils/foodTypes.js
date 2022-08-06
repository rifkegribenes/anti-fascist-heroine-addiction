// Hero health start: 100

// Cherry 1 15
// Raspberry 1 15
// Apple 1 15
// Kiwi 1 15
// Total health possible: 60 (160 total)
// total damage range (@2-3 hits each): 120-180

// Fries 2 30
// Plum 2 30
// Pear 2 30
// Popsicle 2 30
// Total health possible: 120 (280 total)
// total damage range (@1-2 hits each): 120-180 (240-360 total)

// Ice cream 3 50
// Cupcake 3 50
// Hamburger 3 50
// Donut 3 50
// Invis Sufganiyah 3 80
// Total health possible: 230-310 (510-590 total)
// // total damage range (@1-2 hits each): 185-370 (425-730 total not incl final monster)


const foodTypes = [
  {
    name: 'a Cherry',
    title: 'Cherries',
    iconUrl: './img/cherries_32.png?raw=true',
    cardUrl: './img/cherries_200.png?raw=true',
    healthBoost: 15,
    level: 1,
  },
  {
    name: 'a Raspberry',
    title: 'Raspberry',
    iconUrl: './img/raspberry_32.png?raw=true',
    cardUrl: './img/raspberry_200.png?raw=true',
    healthBoost: 15,
    level: 1,
  },
  {
    name: 'an Apple',
    title: 'Apple',
    iconUrl: './img/apple_32.png?raw=true',
    cardUrl: './img/apple_200.png?raw=true',
    healthBoost: 15,
    level: 1,
  },
  {
    name: 'a Kiwi',
    title: 'Kiwi',
    iconUrl: './img/kiwi_32.png?raw=true',
    cardUrl: './img/kiwi_200.png?raw=true',
    healthBoost: 15,
    level: 1,
  },
  {
    name: 'some Fries',
    title: 'Fries',
    iconUrl: './img/fries_32.png?raw=true',
    cardUrl: './img/fries_200.png?raw=true',
    healthBoost: 30,
    level: 2,
  },
  {
    name: 'a Plum',
    title: 'Plum',
    iconUrl: './img/plum_32.png?raw=true',
    cardUrl: './img/plum_200.png?raw=true',
    healthBoost: 30,
    level: 2,
  },
  {
    name: 'a Pear',
    title: 'Pear',
    iconUrl: './img/pear_32.png?raw=true',
    cardUrl: './img/pear_200.png?raw=true',
    healthBoost: 30,
    level: 2,
  },
  {
    name: 'a Popsicle',
    title: 'Popsicle',
    iconUrl: './img/popsicle_32.png?raw=true',
    cardUrl: './img/popsicle_200.png?raw=true',
    healthBoost: 30,
    level: 2,
  },
  {
    name: 'an Ice Cream Cone',
    title: 'Ice Cream Cone',
    iconUrl: './img/ice-cream_32.png?raw=true',
    cardUrl: './img/ice-cream_200.png?raw=true',
    healthBoost: 50,
    level: 3,
  },
  {
    name: 'a Cupcake',
    title: 'Cupcake',
    iconUrl: './img/cupcake_32.png?raw=true',
    cardUrl: './img/cupcake_200.png?raw=true',
    healthBoost: 50,
    level: 3,
  },
  {
    name: 'a Hamburger',
    title: 'Hamburger',
    iconUrl: './img/hamburger_32.png?raw=true',
    cardUrl: './img/hamburger_200.png?raw=true',
    healthBoost: 50,
    level: 3,
  },
  {
    name: 'a Donut',
    title: 'Donut',
    iconUrl: './img/donut_32.png?raw=true',
    cardUrl: './img/donut_200.png?raw=true',
    healthBoost: 50,
    level: 3,
  },
  {
    name: 'the invisible sufganiyah power-up!!!',
    title: 'Invisible Sufganiyah',
    iconUrl: './img/sufganiyah_32.png?raw=true',
    cardUrl: './img/sufganiyah_200.png?raw=true',
    healthBoost: 100,
    level: 3,
  },
];

export default foodTypes;
