const faker = require('faker/locale/it');

class Fighter {
  constructor() {
    // this.name = faker.name.findName();
    this.name = faker.name.firstName();
    this.health = randRange(80, 100);
    this.initialHealth = this.health;
    this.power = randRange(2, 5, 1);
    this.speed = randRange(1, 5, 3);
    this.initialSpeed = this.speed;
  }
}

const random = (max) => {
  return Math.random() * max;
};

const randRange = (min, max, place=0) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(place));
};

const randInt = (max=10) => {
  return Math.floor(Math.random() * max);
}


const calculateSpeed = (fighter) => {
  const speed = fighter.initialSpeed * (fighter.health / fighter.initialHealth);
  return parseFloat(speed.toFixed(3));
};

const start = () => {
  const totalFighters = 10;
  const fighters = [];
  const allAttacks = [];

  // generate fighters
  for(let i = 0; i < totalFighters; ++i) {
    fighters[i] = new Fighter();
  }

  restart(fighters, allAttacks);
}

const restart = (fighters, allAttacks) => {
  fighters.forEach((f1) => {
      let f2 = f1;
      while(f1 === f2)
        f2 = fighters[randInt(fighters.length)];
      attack(fighters, f1, f2, allAttacks);
  });
};

const stop = (allAttacks) => {
  for(let i = 0; i < allAttacks.length; ++i) {
    clearTimeout(allAttacks[i]);
  }
}

const attack = (f, f1, f2, allAttacks) => {

  let delay = 0;
  f1.speed = calculateSpeed(f1);
  f2.speed = calculateSpeed(f2);

  if(f2.health > 0 && f2.health <= 30) {
    f2.speed = parseFloat((f2.speed * 3).toFixed(3));
  } else if (f2.health > 30) {
    f2.speed = f2.initialSpeed;
  }

  if(f2.health <= 0) {
    // all timers cleared
    stop(allAttacks);
    console.log(`[${f2.name}] is dying`);
    // dramatic moment
    const decision = parseInt(Math.random().toFixed()) ? '“Live”' : '“Finish him”';
    console.log(`Caesar showed ${decision} to [${f2.name}]`);
    if(decision === '“Live”') {
      f2.health += 50;
      restart(f, allAttacks);
    } else {
      // remove killed fighter;
      let newFighters = f.filter((fighter) => {
        return fighter.name !== f2.name;
      });
      if(newFighters.length === 1) {
      // declare the winner and quit
        console.log(` [${f1.name}] won the battle with health ${f1.health}`);
        return;
      }
      restart(newFighters, allAttacks);
    }
  } else {
    // choose random fighter
    if(f1.health > 0) {
      console.log(`[${f1.name} x ${f1.health}] hits [${f2.name} x ${f2.health}] with power ${f1.power}`);
      f2.health = parseInt((f2.health - f1.power).toFixed());
      f2 = f1;
      while(f1 === f2)
        f2 = f[randInt(f.length)];
      delay = parseInt((5000 / f1.speed).toFixed());     
      // console.log(delay);
      const timeout = setTimeout(attack, delay, f, f1, f2, allAttacks);
      allAttacks.push(timeout);
    }
  }
};

start();