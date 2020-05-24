export const KEY_LEFT = 37;
export const KEY_UP = 38;
export const KEY_RIGHT = 39;
export const KEY_DOWN = 40;
export const [
  KEY_ZERO,
  KEY_ONE,
  KEY_TWO,
  KEY_THREE,
  KEY_FOUR,
  KEY_FIVE,
  KEY_SIX,
  KEY_SEVEN,
  KEY_EIGHT,
  KEY_NINE
] = [ 48, 49, 50, 51, 52, 53, 54, 55, 56, 57 ];

export const KEY_BACKSPACE = 8;
export const KEY_ESCAPE = 27;
export const KEY_SPACE = 32;
export const KEY_ENTER = 13;

export const KEY_SHIFT = 16;
export const KEY_CONTROL = 17;
export const KEY_ALT = 18;

export const KEY_LEFT_META = 91;
export const KEY_RIGHT_META = 93;

export const [
  KEY_A,
  KEY_C,
  KEY_D,
  KEY_S,
  KEY_V,
  KEY_W,
  KEY_Y,
  KEY_Z
] = [ 65, 67, 68, 83, 86, 87, 89, 90 ];

// Special meta keys
export const [
  KEY_COPY,
  KEY_PASTE,
  KEY_REDO,
  KEY_UNDO,
] = [ 467, 486, 489, 490 ];

export default class KeyState {
  constructor(window) {
    window.addEventListener('keydown', this.onKeyDown.bind(this), false);
    window.addEventListener('keyup', this.onKeyUp.bind(this), false);

    // this.numKeysDown = 0;
    this.newKeysDown = {};
    this.keysDown = {};
    this.newKeysUp = {};
  }

  reset() {
    for (let key in this.newKeysDown) {
      this.newKeysDown[key] = undefined;
    }
    for (let key in this.newKeysUp) {
      this.newKeysUp[key] = undefined;
    }
  }

  onKeyDown(e) {
    let code = e.keyCode;
    if (e.metaKey) {
      code += 400;
    }
    this.newKeysDown[code] = code;
    this.keysDown[code] = code;
    // Uncomment this to log key codes.
    // console.log(`keyCode: ${e.keyCode}, key: '${e.key}'`);
  }

  onKeyUp(e) {
    let code = e.keyCode;
    if (e.metaKey) {
      code += 400;
    }
    this.newKeysUp[code] = code;
    this.keysDown[code] = undefined;
  }

  isKeyDown(keyCode) {
    return (this.keysDown[keyCode] === keyCode);
  }

  isKeyUp(keyCode) {
    return (this.keysDown[keyCode] !== keyCode);
  }
}
