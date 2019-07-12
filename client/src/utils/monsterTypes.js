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
// Rove 2 30
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
    bio: 'Former U.S. President, war criminal, torture apologist, government surveillance enthusiast, notorious liar.',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/bush_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/bush_200.png',
    type: 'monster',
    damage: 15,
    level: 1,
  },
  {
    name: 'Dick Cheney',
    bio: 'Former U.S. Vice President and Halliburton profiteer, war criminal, lover of torture and illegal surveillance, once shot a dude in the face on a quail hunt and didn\'t even apologize.',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/cheney_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/cheney_200.png',
    type: 'monster',
    damage: 15,
    level: 1,
  },
  {
    name: 'Chris Christie',
    bio: 'Governor of New Jersey, destroyer of public education, vetoer of minimum wage increases, hater of gays, bridge-shutter-downer.',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/christie_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/christie_200.png',
    type: 'monster',
    damage: 15,
    level: 1,
  },
  {
    name: 'Scott Walker',
    bio: 'Governor of Wisconsin, crusher of labor unions, suppressor of voting rights, slasher of Planned Parenthood funding.',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/walker_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/walker_200.png',
    type: 'monster',
    damage: 15,
    level: 1,
  },
  {
    name: 'Richard Spencer',
    bio: 'American white supremacist, antisemite, promoter of "ethnic cleansing" and frequent Heiler of Hitler. Yo this dude is a straight-up Nazi.',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/spencer_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/spencer_200.png',
    type: 'monster',
    damage: 30,
    level: 2,
  },
  {
    name: 'Pat Buchanan',
    bio: 'Former senior advisor to Nixon and Reagan, holocaust denier, unrepentant bigot, contributor to anti-immigrant and antisemitic hate groups.',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/buchanan_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/buchanan_200.png',
    type: 'monster',
    damage: 30,
    level: 2,
  },
  {
    name: 'Orrin Hatch',
    bio: 'U.S. Senator from Utah, hater of gays, opposer of fair housing legislation, restricter of civil liberties, destroyer of the enviroment.',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/hatch_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/hatch_200.png',
    type: 'monster',
    damage: 30,
    level: 2,
  },
  {
    name: 'Karl Rove',
    bio: 'Former senior advisor to G.W. Bush, leaker of Valerie Plame\'s identity, war crimes collaborator. Alias: Turd Blossom.',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/rove_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/rove_200.png',
    type: 'monster',
    damage: 30,
    level: 2,
  },
  {
    name: 'Ted Cruz',
    bio: 'U.S. Senator from Texas, ACA-repeal evangelist, suppressor of voter rights, destroyer of the environment, hater of gays, opposer of net neutrality, government shutter-downer.',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/cruz_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/cruz_200.png',
    type: 'monster',
    damage: 45,
    level: 3,
  },
  {
    name: 'Mitch McConnell',
    bio: 'U.S. Senator from Kentucky, health care destroyer, Supreme Court nominee hearing delayer, climate change denier, Iraq war supporter.',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/mcconnell_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/mcconnell_200.png',
    type: 'monster',
    damage: 45,
    level: 3,
  },
  {
    name: 'Steve Bannon',
    bio: 'Former "chief strategist" advisor to President Trump, white supremacist hater of immigrants, jews, gays, women, and pretty much everybody else except his own self, domestic-violencer, seriously creepy neo-Nazi.',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/bannon_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/bannon_200.png',
    type: 'monster',
    damage: 45,
    level: 3,
  },
  {
    name: 'The Propped Up Corpse of Ronald Reagan',
    bio: 'Former U.S. President, cold war escalator, AIDS crisis ignorer, bomber of Libya and Grenada, destabilizer of democratically-elected governments in Central America, and "Trickle-Down Economics" enthusiast. Even beyond the grave, still one of the scariest monsters in the dungeon.',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/reagan_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/reagan_200.png',
    type: 'monster',
    damage: 45,
    level: 3,
  },
];

export default monsterTypes;
