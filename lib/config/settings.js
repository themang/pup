module.exports = {
  shared: true,
  dev: false,
  prod: false,
  development: {
    dev: true,
    logger: true,
    scripts: ['http://localhost:35729/livereload.js']
  },
  ci: {
    dev: true,
  },
  staging: {
    dev: true,
  },
  production: {
    prod: true,
  },
  scripts: ['/bower_components/ace-builds/src-min-noconflict/ace.js', '/build.js'],
  styles: ['/bower.css'],
};