// main

import GameLoop from './world/GameLoop'
import World from './world/World'

let world = new World();

let gameLoop = new GameLoop(update, draw);
gameLoop.start();

// Draw the frame
function draw() {
  world.draw();
}

// Update the world (with milliseconds elapsed since last update)
function update(elapsed) {
  world.update(elapsed);
}
