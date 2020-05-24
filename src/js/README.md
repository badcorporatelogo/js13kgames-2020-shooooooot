## HOW TO

### How to use the API

Add render layers to the world.
Add objects to the layers.

```
let world = new World();
const background = world.layers[0];
const foreground = world.layers[1];
```

Each layer has its own canvas and context.
Lower layers are rendered first.

```
background.context.strokeStyle = 'black';
background.context.lineWidth = 5;
foreground.context.strokeStyle = 'yellow';
foreground.context.lineWidth = 5;

background.addObject(new BoxSprite(50, 50, 100, 100));
foreground.addObject(new BoxSprite(100, 100, 100, 100));
```

Start the game loop.

```
function draw() {
  world.draw();
}

function update(elapsed) {
  world.update(elapsed);
}

let gameLoop = new GameLoop(update, draw);
gameLoop.start();
```

The world update will update each layer.
The world draw will draw each layer.
Layers should only redraw if they are dirty.

The canvas is a fixed resolution, but variable size.
HTML and CSS controls the canvas size, position, and resolution.

Apply animations.

```
import { bellCurve6, arch2, smoothStop6, smoothStart4 } from './math/easing'
import Chain from './actions/Chain'
function exampleMove(sprite) {
  sprite.addAction(new Chain(200, bellCurve6, sprite, 'x', 1));
  sprite.addAction(new Chain(330, smoothStart4, sprite, 'y', 1));
  sprite.isDirty = true;
}
```
