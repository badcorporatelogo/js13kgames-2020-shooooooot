import Colors from '../../settings/Colors'
import RenderLayer from '../RenderLayer'
import SpawnSprite from '../../sprites/enemies/SpawnSprite'
import SeekerSprite from '../../sprites/enemies/SeekerSprite'
import HunterSprite from '../../sprites/enemies/HunterSprite'
import AsteroidSprite from '../../sprites/enemies/AsteroidSprite'
import SpiralSprite from '../../sprites/enemies/SpiralSprite'
import AmmoDropSprite from '../../sprites/enemies/AmmoDropSprite'

import { removeAll } from '../../utility/array'
import { angle, distanceSquared } from '../../math/vector2'
import TimedEvent from '../../actions/TimedEvent'
import implementActionList from '../../traits/ActionList'

const spawnInterval = 5;
const ammoProbability = 0.15;

// Add EnemySprite types here to include in random spawning.
const enemyTypes = [
  SeekerSprite,
  HunterSprite,
  AsteroidSprite,
  SpiralSprite,
];

const spawnPatterns = [
  'boxSpawn',
  'cornerSpawn',
  'sideSpawn',
];

// Returns a value in [0, n-1].
function randomInt(n) {
  return Math.floor(Math.random() * n);
}

function randomSelection(array) {
  const n = array.length;
  const i = randomInt(n);
  return array[i];
}

export default class Simulation extends RenderLayer {
  constructor(name, layer) {
    super(name, layer);

    this.context.strokeStyle = Colors.enemies;
    this.context.fillStyle = Colors.enemies;
    this.context.lineWidth = 4;

    this.enemies = [];

    implementActionList(this);

    let spawnEvent = new TimedEvent(this.spawn.bind(this), spawnInterval);
    spawnEvent.then(spawnEvent);
    this.spawnTimer = spawnEvent;
    this.addAction(this.spawnTimer);
    this.spawn();
  }

  update(t) {
    const updated = super.update(t);
    this.checkForEnemyOnEnemyCollisions()
    return this.updateActions(t) || updated;
  }

  spawn() {
    const T = randomSelection(enemyTypes);
    const pattern = randomSelection(spawnPatterns);
    this[pattern](T);
  }

  boxSpawn(T) {
    const xOffset = Math.floor(this.canvas.width / 8 + Math.random() * (this.canvas.width / 4));
    const yOffset = Math.floor(this.canvas.height / 8 + Math.random() * (this.canvas.height / 4));

    let x = [xOffset, this.canvas.width / 2, this.canvas.width - xOffset];
    let y = [yOffset, this.canvas.height / 2, this.canvas.height - yOffset];

    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        if (i == 1 && j === 1) continue;
        let e = new T(x[i], y[j]);
        this.spawnEnemy(e);
      }
    }
  }

  cornerSpawn(T) {
    const d = Math.floor(this.canvas.height / (Math.random() * 4 + 3));
    const top = d, left = d, bottom = (this.canvas.height - d), right = (this.canvas.width - d);
    const enemies = [];
    this.addCluster(enemies, T, left + randomInt(100), top + randomInt(100));
    this.addCluster(enemies, T, right - randomInt(100), bottom - randomInt(100));
    this.addCluster(enemies, T, right - randomInt(100), top + randomInt(100));
    this.addCluster(enemies, T, left + randomInt(100), bottom);
    for (const e of enemies) {
      this.spawnEnemy(e);
    }
  }

  sideSpawn(T) {
    let x = randomInt(this.canvas.width - 400) + 200;
    let y = randomInt(this.canvas.height - 400) + 200;

    const n = 5;
    const dx = Math.floor(this.canvas.width / (n+2));
    const dy = Math.floor(this.canvas.height / (n+2));
    if (Math.random() < 0.5) {
      for (let i = 1; i <= n; ++i) {
        this.spawnEnemy(new T(x + randomInt(50), i * dy + randomInt(50)));
        this.spawnEnemy(new T(x - randomInt(50) - 50, i * dy + randomInt(50)));
      }
    } else {
      for (let i = 1; i <= n; ++i) {
        this.spawnEnemy(new T(i * dx + randomInt(50), y + randomInt(50)));
        this.spawnEnemy(new T(i * dx + randomInt(50), y - randomInt(50) - 50));
      }
    }
  }

  addCluster(enemies, T, x, y) {
    const offset = randomInt(20) + 60;
    enemies.push(new T(x, y));
    enemies.push(new T(x + offset, y + offset));
    enemies.push(new T(x, y + offset));
    enemies.push(new T(x + offset, y));
  }

  spawnEnemy(e) {
    if (Math.random() <= ammoProbability) {
      e = new AmmoDropSprite(e.x, e.y);
    }
    this.addObject(new SpawnSprite(e.x, e.y, e));
  }

  addEnemy(e) {
    this.enemies.push(e);
    this.addObject(e);
  }

  removeEnemy(o) {
    removeAll(this.enemies, e => e === o);
    this.removeObject(o);
  }

  checkForEnemyOnEnemyCollisions() {
    const enemies = this.enemies;
    for (let i = 0; i < enemies.length; ++i) {
      for (let j = i + 1; j < enemies.length; ++j) {
        const a = enemies[i];
        const b = enemies[j];
        if (this.isCollision(a, b)) {
          if (a instanceof AsteroidSprite) {
            if (b instanceof AsteroidSprite) {
              // bounce
              const angleAB = angle(a, b);
              a.setDirection(angleAB - Math.PI);
              b.setDirection(angleAB);
            }
            // explode after bounce, or else one or both could be dead.
            a.explode();
            b.explode();
          } else if (b instanceof AsteroidSprite) {
            a.explode();
            b.explode();
          }
        }
      }
    }
  }

  isCollision(a, b) {
    const collideAt = a.radius + b.radius;
    return (distanceSquared(a.center(), b.center()) <= (collideAt * collideAt));
  }
}
