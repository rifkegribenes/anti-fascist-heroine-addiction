const hearts = (entity) => {
  let totalHealth;
  let healthNum;
  if (entity.type === 'hero') {
    const healthArray = [160, 280, 510];
    totalHealth = healthArray[entity.level - 1];
    healthNum = Math.floor((entity.hp / totalHealth) * 5) + 1;
    if (entity.hp === 0) { healthNum = 0; }
  } else if (entity.type === 'monster') {
    const healthArray = [70, 243, 515];
    totalHealth = healthArray[entity.level - 1];
    healthNum = Math.floor((entity.health / totalHealth) * 5) + 1;
    if (entity.health === 0) { healthNum = 0; }
  } else if (entity.type === 'finalMonster') {
    totalHealth = 500;
    healthNum = Math.floor((entity.health / totalHealth) * 5) + 1;
    if (entity.health === 0) { healthNum = 0; }
  }
  let heartsArr = [];
  if (healthNum > 0) {
    for (let i = 0; i < healthNum; i++) {
      heartsArr.push('0');
    }
  }
  if (heartsArr.length > 5) {
    heartsArr = [0, 0, 0, 0, 0];
  }
  if (!heartsArr.length) {
    heartsArr = [0];
  }
  return heartsArr;
};

export default hearts;
