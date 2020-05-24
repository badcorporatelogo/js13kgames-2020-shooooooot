const gulp = require('gulp');

const checkFileSize = require('gulp-check-filesize');
const concat = require('gulp-concat');
const deleteFiles = require('gulp-rimraf');
const eslint = require('gulp-eslint');
const imagemin = require('gulp-imagemin');
const lintHTML = require('gulp-htmllint');
const minifyHTML = require('gulp-minify-html');
const minifyCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const replaceHTML = require('gulp-html-replace');
const rollup = require('rollup');
const stylelint = require('gulp-stylelint');
const { terser } = require('rollup-plugin-terser');
const zip = require('gulp-zip');

const paths = {
  src: {
    dir: './src',
    css: 'css/**.css',
    html: '**.html',
    js: {
      input: 'js/main.js',
      all: 'js/**'
    },
    images: 'assets/images/**'
  },
  dist: {
    dir: './dist',
    css: 'style.min.css',
    js: 'script.min.js',
    images: 'dist/images'
  },
  zip: {
    dir: './zip'
  }
};

let rollupCache;

gulp.task('lintHTML', () => {
  return gulp.src(paths.src.html)
    .pipe(lintHTML());
});

gulp.task('lintCSS', () => {
  return gulp.src(paths.src.css)
    .pipe(stylelint({
      reporters: [{ formatter: 'string', console: true }]
    }));
});

gulp.task('lintJS', () => {
  return gulp.src(`${paths.src.dir}/${paths.src.js.all}`)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('cleanDist', () => {
  return gulp.src(`${paths.dist.dir}/*`, { read: false })
    .pipe(deleteFiles());
});

gulp.task('buildHTML', () => {
  return gulp.src(`${paths.src.dir}/${paths.src.html}`)
    .pipe(replaceHTML({
      css: paths.dist.css,
      js: paths.dist.js
    }))
    .pipe(minifyHTML())
    .pipe(gulp.dest(paths.dist.dir));
});

gulp.task('buildCSS', () => {
  return gulp.src(`${paths.src.dir}/${paths.src.css}`)
    .pipe(concat(paths.dist.css))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.dist.dir));
});

gulp.task('buildJS', async function () {
  const input = `${paths.src.dir}/${paths.src.js.input}`;
  const output = `${paths.dist.dir}/${paths.dist.js}`;

  let bundle;

  try {
    bundle = await rollup.rollup({
      cache: rollupCache,
      input,
      plugins: [
        terser()
      ]
    });
  } catch (error) {
    // Fix the error so that when Gulp gets it, it can report the details of where
    // the error was discovered instead of the rollup stack that discovered it.
    // error.loc for the file and position (or error.pos and error.id)
    if (error.loc) {
      const { loc } = error;
      error.stack = `Error: ${error.message}\n    at (${loc.file}:${loc.line}:${loc.column}\n${error.frame}`;
    } else if (error.pos) {
      error.stack = `Error: ${error.message}\n    at (${error.pos}\n${error.id}`;
    }
    throw error;
  }
  rollupCache = bundle.cache;

  await bundle.write({
    compact: true,
    file: output,
    format: 'iife',
    sourcemap: true
  });
});

gulp.task('optimizeImages', () => {
  return gulp.src(`${paths.src.dir}/${paths.src.images}`, {since: gulp.lastRun('optimizeImages')})
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist.images));
});

gulp.task('zip', () => {
  const thirteenKb = 13 * 1024;

  gulp.src('zip/*')
    .pipe(deleteFiles());

  return gulp.src(`${paths.dist.dir}/**`, { ignore: `${paths.dist.dir}/**.map` })
    .pipe(zip('game.zip'))
    .pipe(gulp.dest('zip'))
    .pipe(checkFileSize({ fileSizeLimit: thirteenKb }));
});

gulp.task('test', gulp.parallel(
  'lintHTML',
  'lintCSS',
  'lintJS'
));

gulp.task('build', gulp.series(
  'cleanDist',
  gulp.parallel('buildHTML', 'buildCSS', 'buildJS', 'optimizeImages'),
  'zip'
));

gulp.task('watch', () => {
  gulp.watch(`${paths.src.dir}/${paths.src.html}`, gulp.series('buildHTML', 'zip'));
  gulp.watch(`${paths.src.dir}/${paths.src.css}`, gulp.series('buildCSS', 'zip'));
  gulp.watch(`${paths.src.dir}/${paths.src.js.all}`, gulp.series('buildJS', 'zip'));
  gulp.watch(`${paths.src.dir}/${paths.src.images}`, gulp.series('optimizeImages', 'zip'));
});

gulp.task('default', gulp.series(
  'build',
  'watch'
));
