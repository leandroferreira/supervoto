var gulp = require('gulp');
var runSequence = require('run-sequence');
var bower = require('bower');
var bowerSrc = require('gulp-bower-src');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var compass = require('gulp-compass');
var rjs = require('gulp-requirejs');
var jsonminify = require('gulp-jsonminify');
var del = require('del');

var paths = {
  dev: 'dev/',
  build: 'build/',
  scripts: ['src/js/**/*.js'],
  images: 'src/img/**/*[png,jpg,jpeg,gif,ico]',
  sass: 'src/sass/**/*.sass'
};

var BUILD = 'build';
var DEV = 'dev';
var ENV = BUILD;

// set dev env
gulp.task('set-dev', function(cb) {
  ENV = DEV;
  cb();
});

// clean build folder
gulp.task('clean', function(cb) {
  del(['build'], cb);
});

// install bower packages
gulp.task('bower-install', function(cb) {
  bower.commands.install([], {save: true}, {})
    .on('end', function(installed) {
      cb();
    });
});

// copy bower scripts to build folder
gulp.task('bower-copy', function () {
    bowerSrc()
      .pipe(gulp.dest('src/js/lib'));
});

// copy scripts to build folder
gulp.task('scripts', function() {
  if (ENV === BUILD) {
    return gulp.src('src/js/lib/requirejs/**/*.js')
      .pipe(uglify())
      .pipe(gulp.dest(paths[ENV] + 'js/lib/requirejs'));
  } else {
    return gulp.src(paths.scripts)
      .pipe(gulp.dest(paths[ENV] + 'js'));
  }
});

// compile js files
gulp.task('requirejs', function() {
  return rjs({
      baseUrl: 'src/js/lib',
      paths: {
        supervoto: '../supervoto',
        //jquery: '//code.jquery.com/jquery-2.1.1.min',
        jquery: 'jquery/dist/jquery.min',
        mustache: 'mustache/mustache',
        EventEmitter: 'eventEmitter/EventEmitter.min',
        'jquery-unveil': 'jquery-unveil/jquery.unveil'
      },
      shim: {
        jquery: {exports: '$'},
        'jquery-unveil': ['jquery']
      },
      name: '../app',
      out: 'app.js'
    })
    .pipe(uglify())
    .pipe(gulp.dest(paths[ENV] + 'js'));
});

// copy JSON to build folder
gulp.task('json', function() {
  return gulp.src('src/js/politicos.json')
    .pipe(jsonminify())
    .pipe(gulp.dest(paths[ENV] + 'js'));
});

// copy images to build folder
gulp.task('images', function() {
  if(ENV === BUILD) {
    return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(paths[ENV] + 'img'));
  } else {
    return gulp.src(paths.images)
    .pipe(gulp.dest(paths[ENV] + 'img'));
  }
});

// copy html build to folder
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest(paths[ENV]));
});

// copy fonts to build folder
gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest(paths[ENV] + 'fonts'));
});

// compile compass
gulp.task('compass', function() {
  gulp.src(paths.sass)
  .pipe(compass({
    config_file: './config.rb',
    sass: 'src/sass',
    css: paths[ENV] + 'css',
    image: paths[ENV] + 'img',
    font: paths[ENV] + 'fonts',
    javascript: paths[ENV] + 'js'
  }));
});

// watch for changes
gulp.task('watch', function() {
  gulp.watch('src/*.html', ['html']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.sass, ['compass']);
});

/////////////////
/// USE THESE ///
/////////////////

// install everything we need
gulp.task('install', ['bower-install']);

// do a single dev build
gulp.task('dev-build', function (cb) {
  runSequence('clean', ['html', 'fonts', 'scripts', 'json'], 'images', 'compass', 'bower-copy', cb);
});

// do a single production build
gulp.task('build', function (cb) {
  runSequence('clean', ['html', 'fonts', 'scripts', 'json'], 'images', 'compass', 'bower-copy', 'requirejs', cb);
});

// defaults to dev mode
gulp.task('default', ['set-dev', 'dev-build', 'watch']);