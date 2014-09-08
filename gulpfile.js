var gulp = require('gulp');
var bower = require('bower');
var bowerSrc = require('gulp-bower-src');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var compass = require('gulp-compass');
var del = require('del');

var paths = {
  scripts: ['src/js/**/*.js'],
  images: 'src/img/*[png,jpg,jpeg,gif,ico]',
  sass: 'src/sass/**/*.sass'
};

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
      .pipe(gulp.dest('build/js/lib'));
});

// copy scripts to build folder
gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    //.pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

// copy images to build folder
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});

// copy misc static files to build folder
gulp.task('statics', function(cb) {
  gulp.src('src/*.html').pipe(gulp.dest('build'));
  gulp.src('src/fonts/**/*').pipe(gulp.dest('build/fonts'));
  cb();
});

// compile compass
gulp.task('compass', function() {
  gulp.src(paths.sass)
  .pipe(compass({
    config_file: './config.rb',
    sass: 'src/sass',
    css: 'build/css'
  }));
});

// watch for changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.sass, ['compass']);
  gulp.watch('src/*.html', ['statics']);
});

/////////////////
/// USE THESE ///
/////////////////

// install everything we need
gulp.task('install', ['bower-install']);

// do a single build
gulp.task('build', ['clean', 'compass', 'images', 'statics', 'scripts', 'bower-copy']);

// defaults to dev mode
gulp.task('default', ['build', 'watch']);