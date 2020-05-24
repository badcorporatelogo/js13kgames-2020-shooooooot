# Shooooooot!!

## The Game

```
avoid being hit
point to shoot
max ammo: 404
```

![demo](doc/shooooooot-1.gif)

## Controls

I _strongly_ recommend using a gamepad with dual analog thumbsticks. The game _can_ be played with keyboard and mouse.

### Gamepad

* Left stick to move.
* Right stick to shoot.

### Keyboard/Mouse

* **WASD** or **↑←↓→** to move.
* Left mouse button to shoot (in direction of cursor).

## A game for 2020's js13kgames competition.

This is my entry for the 2020 [js13kgames](http://js13kgames.com/) game jam. The goal is to create an HTML5 game in 13KB or less, in 30 days. Each year, there is a new theme, announced at the start of the competition.

The theme for 2020 is `404`.

## Developing

### Environment Setup

This project depends on nodejs (for specific version, see [.nvmrc](./.nvmrc)). For Mac or Linux, I suggest installing [nvm](https://github.com/creationix/nvm).

With nvm installed, do the following:
```
nvm install
nvm use
```

Install dependencies like so:
```
npm install
npm install -g gulp-cli
```

Build the app:
```
gulp build
```

Build and auto-rebuild on file changes:
```
gulp
```

### JavaScript Code

The build process uses [rollup.js](https://rollupjs.org/) to build `main.js`. All other files are included via JavaScript `import` statements. The code is minified and tree shaking is enabled, so any files that aren't imported won't be in the final script. I set it up this way for the least hassle during development.

### Files

| Directory | Description |
|-----------|-------------|
| [dist](./dist) | Build outputs (html, css, js).
| [src/css](./src/css) | CSS source files.
| [src/assets](./src/assets) | Non-code source assets, like png or wav.
| [src/js](./src/js) | JavaScript source files.
| [zip](./zip) | Zipped build outputs (game.zip). This needs to be less than 13KB.
