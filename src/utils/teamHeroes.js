// Hero start: 10

// America Chavez 1 5
// Wonder Woman 1 5
// Crimson Avenger 1 5
// Devi 1 5
// Sabra 1 5
// TOTAL: (4 from level 1 + hero L1) 30

// Dust 2 10
// La Borinqueña 2 10
// Ms Marvel 2 10
// Silk 2 10
// Misty Knight 2 10
// TOTAL: 70 * 1.5 = 135

// Grace Choi 3 10
// Storm 3 10
// The Wasp 3 10
// Shakti 3 20
// Amihan 3 20
// TOTAL: 166 * 2 = 332


const teamHeroes = [
  {
    name: 'America Chavez',
    powers: 'Superhuman strength, speed, and durabilty; Flight; Inter-reality transportation',
    aliases: 'Ms. America, MAC',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/america-chavez_32_c.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/america-chavez_200.png',
    damage: 5,
    level: 1,
    createdBy: 'Joe Casey, Nick Dragotta',
    srcName: 'Marvel NOW! Point One #1',
    srcUrl: 'http://marvel.wikia.com/wiki/Marvel_NOW!_Point_One_Vol_1_1',
    artBy: 'Jamie McKelvie, Mike Norton, Matthew Wilson',
  },
  {
    name: 'Wonder Woman',
    powers: 'Superhuman strength, speed, durability, and longevity; Flight; Lasso of Truth',
    aliases: 'Princess Diana of Themyscira',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/wonder-woman_32_c.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/wonder-woman_200.png',
    damage: 5,
    level: 1,
    createdBy: 'William Moulton Marston, Harry G. Peter',
    srcName: 'Wonder Woman v.2 63',
    srcUrl: 'http://dc.wikia.com/wiki/Wonder_Woman_(Diana_Prince)?file=Wonder_Woman_v.2_63.jpg',
    artBy: 'Brian Bolland',
  },
  {
    name: 'Crimson Avenger',
    powers: 'Teleportation, Intangibility',
    aliases: 'Jill Carlyle',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/crimson-avenger_32_c.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/crimson-avenger_200.png',
    damage: 5,
    level: 1,
    createdBy: 'Geoff Johns, Scott Kolins',
    srcName: 'JSA #52',
    srcUrl: 'https://en.wikipedia.org/wiki/Crimson_Avenger#/media/File:CrimsonAvengerIII.jpg',
    artBy: 'Carlos Pacheco',
  },
  {
    name: 'Devi',
    powers: 'Warrior-goddess, protector of mankind, and savior of her city, Sitapur',
    aliases: 'Tara Mehta',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/devi_32_c.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/devi_200.png',
    damage: 5,
    level: 1,
    createdBy: 'Shekhar Kapur',
    srcName: 'Devi – The Goddess Of Light | Vol. 3',
    srcUrl: 'https://graphicindia.com/portfolio/devi/',
    artBy: 'Saumin Patel',
  },
  {
    name: 'Nubia',
    powers: 'Superhuman strength, speed, durability, and longevity, Flight, Healing (Wonder Woman\'s twin sister)',
    aliases: 'Wonder Woman, Nu\'bia',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/nubia_32_c.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/nubia_200.png',
    damage: 5,
    level: 1,
    createdBy: 'Doselle Young, Brian Denham',
    srcName: 'Injustice 2 #29',
    srcUrl: 'https://comicnewbies.files.wordpress.com/2017/10/nubia-as-wonder-woman-injustice-ii-3.jpg',
    artBy: 'Bruno Redondo',
  },
  {
    name: 'Dust',
    powers: 'Able to transform into and control a malleable sand form',
    aliases: 'Sooraya Qadir',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/dust_32_c.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/dust_200.png',
    damage: 10,
    level: 2,
    createdBy: '',
    srcName: '',
    srcUrl: '',
    artBy: '',
  },
  {
    name: 'La Borinquena',
    powers: 'Superhuman strength, Flight, Control over storms',
    aliases: 'Marisol Rios De La Luz',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/la-borinquena_32_c.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/la-borinquena_200.png',
    damage: 10,
    level: 2,
    createdBy: '',
    srcName: '',
    srcUrl: '',
    artBy: '',
  },
  {
    name: 'Ms. Marvel',
    powers: 'Shapeshifting, Healing',
    aliases: 'Kamala Khan',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/ms-marvel_32_c.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/ms-marvel_200.png',
    damage: 10,
    level: 2,
    createdBy: '',
    srcName: '',
    srcUrl: '',
    artBy: '',
  },
  {
    name: 'Silk',
    powers: 'Superhuman strength, speed, agility, stamina, reflexes and endurance; Long range precognitive Spider-sense, Eidetic memory',
    aliases: 'Cindy Moon',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/silk_32_c.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/silk_200.png',
    damage: 10,
    level: 2,
    createdBy: '',
    srcName: '',
    srcUrl: '',
    artBy: '',
  },
  {
    name: 'Misty Knight',
    powers: 'Highly skilled martial artist, Bionic right arm, Superhuman strength, Magnetism',
    aliases: 'Mercedes Kelly Knight, Maya Corday',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/misty-knight_32_c.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/misty-knight_200.png',
    damage: 10,
    level: 2,
    createdBy: '',
    srcName: '',
    srcUrl: '',
    artBy: '',
  },
  {
    name: 'Grace Choi',
    powers: 'Superhuman strength, durability, and regeneration',
    aliases: 'Grace Choi',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/grace-choi_32_c.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/grace-choi_200.png',
    damage: 10,
    level: 3,
    createdBy: '',
    srcName: '',
    srcUrl: '',
    artBy: '',
  },
  {
    name: 'Storm',
    powers: 'Weather manipulation',
    aliases: 'Ororo Munroe',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/storm_32_c.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/storm_200.png',
    damage: 10,
    level: 3,
    createdBy: '',
    srcName: '',
    srcUrl: '',
    artBy: '',
  },

  {
    name: 'The Wasp',
    powers: 'Size manipulation, Flight, Bio-electric energy blasts, Telepathic insect control',
    aliases: 'Janet van Dyne, Winsome Wasp',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/the-wasp_32_c.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/the-wasp_200.png',
    damage: 10,
    level: 3,
    createdBy: '',
    srcName: '',
    srcUrl: '',
    artBy: '',
  },
  {
    name: 'Shakti',
    powers: 'Can produce fire, Can travel with speed of light, Third eye',
    aliases: 'Chanda',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/shakti_32_c.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/shakti_200.png',
    damage: 20,
    level: 3,
    createdBy: '',
    srcName: '',
    srcUrl: '',
    artBy: '',
  },
  {
    name: 'White Fox',
    powers: 'Heightened Senses, Claws, Communication with Animals',
    aliases: 'Ami Han, Agent F-One',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/amihan_32_c.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/amihan_200.png',
    damage: 20,
    level: 3,
    createdBy: '',
    srcName: '',
    srcUrl: '',
    artBy: '',
  },
];

export default teamHeroes;
