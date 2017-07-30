// Hero attack start: 10

// GWB 1 15
// Cheney 1 15
// Christie 1 15
// Walker 1 15
// (health btw 60-70 each)
// Hero attack end L1: 30
// total damage range (@2-3 hits each): 120-180

// Spencer 2 30
// Buchanan 2 30
// Hatch 2 30
// Flake 2 30
// (health btw 222-242 each)
// Hero attack end L2: 135
// total damage range (@1-2 hits each): 120-180

// Cruz 3 45
// McConnnell 3 45
// Bannon 3 45
// Reagan 3 50
// (health btw 465-475 each)
// Hero attack end L3: 332
// // total damage range (@1-2 hits each): 185-370


const monsterTypes = [
  {
    name: 'George W. Bush',
    bio: '',
    youDiedMsg: '',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/bush_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/bush_200.png',
    type: 'monster',
    damage: 15,
    level: 1,
  },
  {
    name: 'Dick Cheney',
    bio: '',
    youDiedMsg: '',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/cheney_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/cheney_200.png',
    type: 'monster',
    damage: 15,
    level: 1,
  },
  {
    name: 'Chris Christie',
    bio: '',
    youDiedMsg: '',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/christie_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/christie_200.png',
    type: 'monster',
    damage: 15,
    level: 1,
  },
  {
    name: 'Scott Walker',
    bio: '',
    youDiedMsg: '',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/walker_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/walker_200.png',
    type: 'monster',
    damage: 15,
    level: 1,
  },
  {
    name: 'Richard Spencer',
    bio: '',
    youDiedMsg: '',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/spencer_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/spencer_200.png',
    type: 'monster',
    damage: 30,
    level: 2,
  },
  {
    name: 'Pat Buchanan',
    bio: '',
    youDiedMsg: '',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/buchanan_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/buchanan_200.png',
    type: 'monster',
    damage: 30,
    level: 2,
  },
  {
    name: 'Orrin Hatch',
    bio: '',
    youDiedMsg: '',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/hatch_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/hatch_200.png',
    type: 'monster',
    damage: 30,
    level: 2,
  },
  {
    name: 'Jeff Flake',
    bio: '',
    youDiedMsg: '',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/flake_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/flake_200.png',
    type: 'monster',
    damage: 30,
    level: 2,
  },
  {
    name: 'Ted Cruz',
    bio: '',
    youDiedMsg: '',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/cruz_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/cruz_200.png',
    type: 'monster',
    damage: 45,
    level: 3,
  },
  {
    name: 'Mitch McConnell',
    bio: '',
    youDiedMsg: '',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/mcconnell_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/mcconnell_200.png',
    type: 'monster',
    damage: 45,
    level: 3,
  },
  {
    name: 'Steve Bannon',
    bio: '',
    youDiedMsg: '',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/bannon_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/bannon_200.png',
    type: 'monster',
    damage: 45,
    level: 3,
  },
  {
    name: 'The Propped Up Corpse of Ronald Reagan',
    bio: '',
    youDiedMsg: '',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/reagan_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/reagan_200.png',
    type: 'monster',
    damage: 45,
    level: 3,
  },
];

export default monsterTypes;
