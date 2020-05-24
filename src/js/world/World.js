import { renderArea } from './dom'
import Colors from '../settings/Colors'
import { mute, unmute } from '../settings/volume'
import Intro from './layers/Intro'
import Background from './layers/Background'
import Simulation from './layers/Simulation'
import Player from './layers/Player'
import Hud from './layers/Hud'
import GameOver from './layers/GameOver'

export default class World {
  constructor() {
    this.gameIsStarted = false;
    this.gameIsOver = false;
    renderArea.style.background = Colors.background;
    this.layer = {};
    this.layers = [];
    this.highScore = 0;

    this.intro();
  }

  addLayer(layer) {
    layer.parent = this;
    this.layer[layer.name] = layer;
    this.layers.push(layer);
  }

  resetLayers() {
    for (const l of this.layers) {
      l.parent = null;
      l.dispose();
    }
    this.layers.length = 0;
    this.layer = {};
  }

  update(elapsed) {
    for (const layer of this.layers) {
      layer.update(elapsed)
    }

    if (this.gameIsStarted && !this.gameIsOver && this.layer.player.player.exploded) {
      this.gameOver();
    }
  }

  draw() {
    for (const layer of this.layers) {
      layer.draw();
    }
  }

  intro() {
    this.resetLayers();
    this.addLayer(new Intro('intro', 0));
  }

  start() {
    this.resetLayers();
    unmute();
    this.addLayer(new Background('background', 0));
    this.addLayer(new Simulation('simulation', 1));
    this.addLayer(new Player('player', 2));
    this.addLayer(new Hud('hud', 3));
    this.gameIsOver = false;
  }

  gameOver() {
    if (!this.gameIsOver) {
      mute();
      this.addLayer(new GameOver('gameover', 4));
      this.gameIsOver = true;
      const latestScore = this.layer.hud.score;
      if (latestScore > this.highScore) {
        // New high score!
        this.highScore = latestScore;
        this.layer.gameover.showMessage(`New High Score: ${latestScore}!!`);
      } else {
        this.layer.gameover.showMessage(`Score to Beat: ${this.highScore}`);
      }
    }
  }
}
