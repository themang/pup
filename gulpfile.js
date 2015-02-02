/**
 * Modules
 */

// gulp
var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var symlink = require('gulp-symlink');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// browserify watch
var watchify = require('watchify');

// browserify transforms
var browserify = require('browserify');
var debowerify = require('debowerify');
var dehtmlify = require('dehtmlify');
var sassify = require('sassify');

// node
var fs = require('fs');
var child_process = require('child_process');
var rimraf = require('rimraf');

/**
 * Tasks
 */

gulp.task('unlink-lib', unlink('lib'));
gulp.task('unlink-pages', unlink('pages'));
gulp.task('unlink-public', rimrafPublic);

//enables lib and pages shortcuts
gulp.task('link-lib', ['unlink-lib'], link('lib'));
gulp.task('link-pages', ['unlink-pages'], link('pages'));

// create public dir
gulp.task('public', ['unlink-public'], makePublic);

// Dev
gulp.task('build', ['public', 'link-lib', 'link-pages'], bundle);
gulp.task('dev', ['build'], startApp);

/**
 * Bundler
 */

var bundler = watchify(browserify('./client.js', watchify.args))
  .transform(debowerify, {global: true})
  .transform(dehtmlify, {global: true})
  .transform(sassify, {global: true})
  .on('update', bundle);

function bundle() {
  return bundler.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('build.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./public'))
    .pipe(livereload());
}

function makePublic() {
  try {
    fs.mkdirSync('public');
  } catch(e) {

  }
}

function rimrafPublic(cb) {
  rimraf('./public', cb);
}

function link(dir) {
  dir = dir || 'lib';
  return function() {
    return gulp.src(dir)
      .pipe(symlink('node_modules/' + dir));
  }
}

function unlink(dir) {
  dir = dir || 'lib';
  return function() {
    try {
      fs.unlinkSync('node_modules/' + dir);
    } catch(e) {
      if(e.code !== 'ENOENT')
        throw e;
    }
  }
}

var app;
process.on('uncaughtException', function(errs) {
  app && app.kill();
  // Sometimes we throw an arary of errors,
  // so normalize that case
  [].concat(errs).forEach(function(err) {
    // Don't print out jshint error stacks
    if(!err.stack || err.stack.indexOf('JSHint') === -1)
      console.log('uncaught exception'.red, err, err.stack);
  });
  process.exit(-1);
});

function startApp(cb) {
  livereload.listen();

  var app = child_process.fork('server.js');

  app.on('message', function(msg) {
    if(msg === 'listening')
      cb && cb();
  });
}