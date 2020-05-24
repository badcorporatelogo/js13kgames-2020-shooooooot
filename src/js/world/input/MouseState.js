// Mouse States:
// - Out: Start state. Off-element or unknown.
// - Moving: Tracks position.
// - Dragging: Tracks position with button down.
const OutState = 'Out';
const MovingState = 'Moving';
const DraggingState = 'Dragging';

// Mouse up/down event.which identifies a button by numeral.
const LeftMouseButton = 1;

export default class MouseState {
  constructor(canvas) {
    // We need to translate between client space and canvas space, and that
    // requires the current dimensions of the canvas (in case of resize).
    this.canvas = canvas;

    // Input events we care about.
    canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    canvas.addEventListener('mouseout', this.onMouseOut.bind(this), false);
    canvas.addEventListener('mouseup', this.onMouseUp.bind(this), false);

    this.state = OutState;
    this.isMouseDown = false;
    this.isMouseOver = false;
    this.current = {};
    this.dragging = null;
    this.dragComplete = null;
  }

  clientToCanvas(e, position = {}) {
    const canvas = this.canvas;
    position.x = e.offsetX * canvas.width / canvas.clientWidth;
    position.y = e.offsetY * canvas.height / canvas.clientHeight;
    return position;
  }

  updateCurrent(e) {
    this.clientToCanvas(e, this.current);
  }

  log(e) {
    // console.log(`${e.type} at (${e.offsetX}, ${e.offsetY})`);
  }

  reset() {
    this.isMouseOver = false;
    this.isMouseDown = false;
    this.current = {};
    this.dragging = null;
    this.dragComplete = null;
  }

  drop() {
    const drop = this.dragComplete;
    this.dragComplete = null;
    return drop;
  }

  onMouseEvent(e) {
    this.log(e);
    this.isMouseOver = true;
    this.updateCurrent(e);
  }

  onMouseMove(e) {
    this.onMouseEvent(e);

    this.state = MovingState;
  }

  onMouseOut(e) {
    this.onMouseEvent(e);
    this.reset();

    this.state = OutState;
  }

  onBeginDrag(e) {
    this.dragging = {
      begin: this.clientToCanvas(e),
      end: this.current // <-- reference
    };
  }

  onEndDrag(e) {
    this.dragging.end = this.clientToCanvas(e);
    this.dragComplete = this.dragging;
    this.dragging = null;
  }

  onMouseDown(e) {
    this.onMouseEvent(e);
    // Look at the old state to deal with weird things like starting the game
    // with the button pressed, or entering the canvas with button pressed.
    const alreadyDown = this.isMouseDown;
    const becameDown = (e.which === LeftMouseButton);
    if (!alreadyDown && becameDown) {
      // Begin drag
      this.isMouseDown = true;
      this.onBeginDrag(e);

      this.state = DraggingState;
    } else if (this.state === OutState) {
      this.state = MovingState;
    }
  }

  onMouseUp(e) {
    this.onMouseEvent(e);
    // Look at the old state to deal with weird things like starting the game
    // with the button pressed, or entering the canvas with button pressed.
    const alreadyDown = this.isMouseDown;
    const becameUp = (e.which === LeftMouseButton);
    if (alreadyDown && becameUp) {
      this.isMouseDown = false;
      this.onEndDrag(e);

      this.state = MovingState;
    } else if (this.state === OutState) {
      this.state = MovingState;
    }
  }
}
