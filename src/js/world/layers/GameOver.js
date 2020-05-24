import Chain from '../../actions/Chain'
import { smoothStop4 } from '../../math/easing'
import implementActionList from '../../traits/ActionList'
import Colors from '../../settings/Colors'
import TextSprite from '../../sprites/TextSprite'
import KeyState from '../input/KeyState'
import { KEY_ENTER } from '../input/KeyState'
import RenderLayer from '../RenderLayer'

const textFont = '96px verdana';
const textHeight = 96 * 1.25;
const infoFont = '64px verdana';
const infoHeight = 64 * 1.25;

export default class GameOver extends RenderLayer {
  constructor(name, layer) {
    super(name, layer);
    implementActionList(this);

    this.context.strokeStyle = Colors.enemies;
    this.context.fillStyle = Colors.player;
    this.context.lineWidth = 8;
    this.context.font = textFont;
    this.context.textAlign = 'center';

    this.addAction(new Chain(1, smoothStop4, this, 'ease', .75));
    this.keys = new KeyState(window);

    this.gameText = new TextSprite('GAME', this.canvas.width / 2, 0 - textHeight);
    this.overText = new TextSprite('OVER', this.canvas.width / 2, this.canvas.height);// + textHeight);
    this.addObject(this.gameText);
    this.addObject(this.overText);
    this.addAction(new Chain(this.canvas.height / 2, smoothStop4, this.gameText, 'y', 0.5));
    this.addAction(new Chain(-this.canvas.height / 2, smoothStop4, this.overText, 'y', 0.5));
  }

  showMessage(message) {
    const highScore = new TextSprite(message, this.canvas.width / 2, this.canvas.height + textHeight);
    this.addObject(highScore);
    this.addAction(new Chain(-this.canvas.height / 2 + textHeight, smoothStop4, highScore, 'y', 1.5));
  }

  update(t) {
    super.update(t);
    this.updateActions(t);
    const gp = navigator.getGamepads()[0];
    if (this.keys.isKeyDown(KEY_ENTER)) {
      this.parent.start();
    } else if (gp && gp.buttons[0].pressed) {
      this.parent.start();
    }
    this.isDirty = true;
  }

  draw() {
    super.draw();
    const ctx = this.context;
    ctx.save();
    ctx.font = infoFont;
    ctx.fillStyle = Colors.enemies;
    const x = this.canvas.width / 2;
    const y = this.canvas.height - infoHeight - infoHeight;
    ctx.fillText('Press Enter or Button 0 to Restart', x, y);
    ctx.restore();
  }
}
