export default class Chain {
  // s - scale
  // f - function
  // o - object
  // p - property
  // d - duration
  constructor(s, f, o, p, d) {
    this.s = s;
    this.f = f;
    this.o = o;
    this.p = p;
    this.d = d;
    this.t = 0;
    this.isStarted = false;
    this.isDone = false;
    this.parent = null; // set by Sprite.addAction
  }

  // t - elapsed time since last update
  update(t) {
    if (!this.isStarted) {
      this.isStarted = true;
      this.startValue = this.o[this.p] || 0;
    } else if (!this.isDone) {
      this.t += t/this.d;
      let remainder = 0;
      if (this.t > 1) {
        remainder = this.t - 1;
        this.t = 1;
        this.isDone = true;
      }
      this.o[this.p] = this.startValue + this.s * this.f(this.t);
      if (this.isDone && this.next) {
        if (this.next !== this) {
          this.parent.addAction(this.next);
        }
        this.next.start();
        this.next.update(remainder);
      }
    }
  }

  // explicit start so we can skip the initial position
  start() {
    this.isStarted = false;
    this.t = 0;
    this.isDone = false;
    this.update(0);
  }

  // enable: new Chain().then(new Chain()).then(new Chain())...
  then(next) {
    if (this.next) {
      this.next.then(next);
    } else {
      this.next = next;
    }
    return this;
  }
}
