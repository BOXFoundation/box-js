/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const tsify = require('tsify')
const watchify = require('watchify')
const gutil = require('gulp-util')
const uglify = require('gulp-uglify-es').default
const sourcemaps = require('gulp-sourcemaps')
const buffer = require('vinyl-buffer')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')

/* watch browserify */
const watchedBrowserify = watchify(browserify({
  basedir: '.',
  debug: true,
  entries: ['src/boxd/boxd.ts'],
  cache: {},
  packageCache: {}
}).plugin(tsify))

const watchedBundle = () => {
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
    .pipe(uglify({
      compress: {
        warnings: false,
        drop_console: true,
        drop_debugger: true
      }
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist-script'))
}

const browserifyBundle = () => {
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
    .pipe(uglify({
      compress: {
        warnings: false,
        drop_console: true, // console filter
        drop_debugger: true // debugger filter
      }
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist-script'))
}

gulp.task('watch:web', function () {
  return watchedBundle()
})

gulp.task('build:node', function () {
  return gulp.src('src/**/*.ts').pipe(tsProject()).js.pipe(gulp.dest('dist'))
})

gulp.task('build:web', function () {
  return gulp.src('src/**/*.ts').pipe(tsProject()).js.pipe(gulp.dest('dist-web'))
})

gulp.task('build:script', function () {
  return browserifyBundle()
})

gulp.task('build', gulp.series(['build:node', 'build:web', 'build:script']))

gulp.task('default', gulp.series('build'))

watchedBrowserify.on('update', browserifyBundle)
watchedBrowserify.on('log', gutil.log)