const maxTick = 1/15;

export default class GameLoop {
  constructor(update, draw) {
    this.update = update;
    this.draw = draw;
    this.nextTick = this.tick.bind(this);
  }

  start() {
    const firstTick = this.init.bind(this);
    window.requestAnimationFrame(firstTick);
  }

  // In the very first frame, we want elapsedTime to be zero.
  init(timeStamp) {
    this.lastTimeStamp = timeStamp;
    this.tick(timeStamp);
  }

  tick(timeStamp) {
    let elapsedTime = (timeStamp - this.lastTimeStamp) / 1000;
    this.lastTimeStamp = timeStamp;

    // If we're debugging and stopped at a breakpoint during the last frame, the
    // elapsed time will be huge. If that happens, reset the clock. Same if we
    // drop below 15 frames per second.
    if (elapsedTime > maxTick) {
      elapsedTime = maxTick;
    }

    this.update(elapsedTime);

    // Perform the drawing operation
    this.draw();

    // The loop function has reached it's end. Keep requesting new frames
    window.requestAnimationFrame(this.nextTick);
  }
}
