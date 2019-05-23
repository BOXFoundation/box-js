const gulp = require("gulp");
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");
const watchify = require("watchify");
const gutil = require("gulp-util");
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');

const watchedBrowserify = watchify(browserify({
  basedir: '.',
  debug: true,
  entries: ['src/boxd/boxd.ts'],
  cache: {},
  packageCache: {}
}).plugin(tsify));

function browserifyBundle() {
  return browserify({
      basedir: '.',
      debug: true,
      entries: ['src/boxd/boxd.ts'],
      cache: {},
      packageCache: {}
    }).plugin(tsify).transform('babelify', {
      presets: ['env'],
      extensions: ['.ts']
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("dist"))
}

function watchedBundle() {
  return watchedBrowserify
    .transform('babelify', {
      presets: ['env'],
      extensions: ['.ts']
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("dist"));
}

gulp.task("watch", function () {
  return watchedBundle();
})

gulp.task("build", function () {
  return browserifyBundle();
})

gulp.task("default", gulp.series('build'));
watchedBrowserify.on("update", browserifyBundle);
watchedBrowserify.on("log", gutil.log);