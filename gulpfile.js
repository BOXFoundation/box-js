var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
/* var paths = {
  pages: ['src/*.html']
}; */

// const sourcemaps = require('gulp-sourcemaps');
// const babel = require('gulp-babel');

// gulp.task('default', () =>
//   gulp
//     .src('src/**/*.js')
//     .pipe(sourcemaps.init())
//     .pipe(babel())
//     .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest('dist'))
// );

var watchedBrowserify = watchify(browserify({
  basedir: '.',
  debug: true,
  entries: ['src/main.ts'],
  cache: {},
  packageCache: {}
}).plugin(tsify));

function bundle() {
  return watchedBrowserify
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));
}

gulp.task("default", bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);