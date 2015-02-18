/**
 * Modules
 */

// gulp
var gulp = require('gulp');



var browserifyTask = require('gulp-browserify-bundle-task');
var bowerCssTask = require('gulp-bower-css-task');
var serverTask = require('gulp-server-task');
var linkTasks = require('gulp-link-tasks');
var link = linkTasks.link;
var unlink = linkTasks.unlink;
var rmdir = linkTasks.rmdir;
var mkdir = linkTasks.mkdir;

var PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Tasks
 */

//enables lib and pages shortcuts
gulp.task('unlink', unlink('lib', 'pages').from('node_modules'));
gulp.task('link', link('lib', 'pages').to('node_modules'));

// create public dir
gulp.task('rimraf-public', rmdir('public'));
gulp.task('public', ['rimraf-public'], mkdir('public'));

gulp.task('assets', ['public'], link('assets', 'bower_components').watch(!PRODUCTION).to('public'));

gulp.task('bower-css', ['public'], bowerCssTask({devMode: !PRODUCTION}));

// Dev
gulp.task('browserify', ['public', 'link'], browserifyTask({devMode: !PRODUCTION}));

gulp.task('build', ['browserify', 'bower-css', 'assets']);
gulp.task('dev', ['build'], serverTask('server.js'));





