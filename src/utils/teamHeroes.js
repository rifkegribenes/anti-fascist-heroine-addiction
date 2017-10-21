// Hero start: 10

// America Chavez 1 5
// Wonder Woman 1 5
// Crimson Avenger 1 5
// Devi 1 5
// TOTAL: 30

// Dust 2 10
// La Borinqueña 2 10
// Ms Marvel 2 10
// Silk 2 10
// TOTAL: 70 * 1.5 = 135

// Psylocke 3 10
// Storm 3 10
// The Wasp 3 10
// She Hulk 3 20
// Zatanna 3 20
// TOTAL: 166 * 2 = 332

const teamHeroes = [
  {
    name: 'America Chavez',
    message: 'Superhuman strength, speed, and durabilty; Flight; Inter-reality transportation',
    aliases: 'Ms. America, MAC',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/america-chavez_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/america-chavez_200.png',
    damage: 5,
    level: 1,
  },
  {
    name: 'Wonder Woman',
    message: 'Superhuman strength, speed, durability, and longevity; Flight; Hand-to-hand combat; Lasso of Truth, indestructible bracelets, boomerang tiara, sword, and shield',
    aliases: 'Princess Diana of Themyscira, Diana Prince',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/wonder-woman_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/wonder-woman_200.png',
    damage: 5,
    level: 1,
  },
  {
    name: 'Crimson Avenger',
    message: 'Teleportation, Intangibility',
    aliases: 'Jill Carlyle',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/crimson-avenger_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/crimson-avenger_200.png',
    damage: 5,
    level: 1,
  },
  {
    name: 'Devi',
    message: 'Celestial warrior goddess created by the gods to fight the renegade god Bala',
    aliases: 'Tara Mehta',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/devi_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/devi_200.png',
    damage: 5,
    level: 1,
  },
  {
    name: 'Dust',
    message: 'Able to transform into and control a malleable sand form',
    aliases: 'Sooraya Qadir',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/dust_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/dust_200.png',
    damage: 10,
    level: 2,
  },
  {
    name: 'La Borinqueña',
    message: 'Superhuman strength, Flight, Control over storms',
    aliases: 'Marisol Rios De La Luz',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/la-borinquena_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/la-borinquena_200.png',
    damage: 10,
    level: 2,
  },
  {
    name: 'Ms. Marvel',
    message: 'Shapeshifting, Healing',
    aliases: 'Kamala Khan',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/kamala-khan_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/kamala-khan_200.png',
    damage: 10,
    level: 2,
  },
  {
    name: 'Silk',
    message: 'Superhuman strength, speed, agility, stamina, reflexes and endurance; Hand-to-hand combat, Healing, Long range precognitive Spider-sense, Eidetic memory',
    aliases: 'Cindy Moon',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/silk_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/silk_200.png',
    damage: 10,
    level: 2,
  },
  {
    name: 'Psylocke',
    message: 'Telekinesis, Telepathy, Precognition, Expert martial artist',
    aliases: 'Elizabeth "Betsy" Braddock, Lady Mandarin',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/psylocke_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/psylocke_200.png',
    damage: 10,
    level: 3,
  },
  {
    name: 'Storm',
    message: 'Weather manipulation',
    aliases: 'Ororo Munroe',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/storm_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/storm_200.png',
    damage: 10,
    level: 3,
  },

  {
    name: 'Panda',
    message: 'Baby Panda can hug monsters to death',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/panda_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/panda_200.png',
    damage: 10,
    level: 3,
  },
  {
    name: 'Red Panda',
    message: 'Red Panda is quick and smart, her claws and teeth are sharp',
    iconUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/red-panda_32.png',
    cardUrl: 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/red-panda_200.png',
    damage: 20,
    level: 3,
  },
];

export default teamHeroes;
