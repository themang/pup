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
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var csso = require('gulp-csso');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var File = require('vinyl');
var watch = require('gulp-watch');

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
var rework = require('rework');
var reworkURL = require('rework-plugin-url');
var es = require('event-stream');
var path = require('path');
var glob = require('glob');
var mkdirp = require('mkdirp');


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

gulp.task('assets', ['public'], assets);

gulp.task('bower-css', ['public'], bowerCss);
gulp.task('bower-assets', ['bower-css'], function() {
  return gulp.src('bower_components')
    .pipe(symlink('public/bower_components'));
});


// Dev
gulp.task('build', ['public', 'link-lib', 'link-pages'], bundle);
gulp.task('dev', ['build', 'bower-assets', 'assets'], startApp);

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
    .on('error', function(err) {
      console.log('stack', err.stack);
    })
    .pipe(source('build.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./public'))
    .pipe(livereload());
}


function bowerCss() {
  
  var cssFilter = filter('**/*.css');

  return gulp.src('./bower.json')
    .pipe(es.through(pluckFilesFromJson('dependencies')))
    .pipe(es.mapSync(function(name) {
      return path.join('bower_components', name, '/bower.json');
    }))
    .pipe(vinylify())
    .pipe(es.through(pluckFilesFromJson('main')))
    .pipe(vinylify())
    .pipe(cssFilter)
    .pipe(es.mapSync(function(file) {
      var css = file.contents.toString('utf8')
        , res = rework(css)
        .use(urlRewriter(file))
        .toString({sourcemap: true});

      file.contents = new Buffer(res);
      return file;
    }))
    .on('error', logError)
    .pipe(concat('bower.css'))
    .pipe(gulp.dest('public'));
}

function assets() {
  watch('assets/**')
    .pipe(gulp.dest('public'));
    
  return gulp.src(['assets/**'])
    .pipe(gulp.dest('public'));
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

function vinylify(base) {
  base = base || process.cwd();
  return es.through(function(file) {
    if(file[0] !== '/')
      file = path.join(base, file);

    console.log('file', file, fs.existsSync(file));
    fs.existsSync(file) && this.emit('data', new File({
      path: file,
      base: base,
      contents: fs.readFileSync(file)
    }));
  });
}

function pluckFilesFromJson(prop) {
  return function(file) {
    var self = this
      , json = JSON.parse(file.contents.toString('utf8'));

    if(Array.isArray(json[prop])) {
      json[prop].forEach(function(p) {
        self.emit('data', path.resolve(path.dirname(file.path), p));
      });
    } else if (typeof json[prop] === 'object') {
      Object.keys(json[prop]).forEach(function(name) {
        self.emit('data', name);
      });
    } else {
      self.emit('data', path.resolve(path.dirname(file.path), json[prop]));
    }
  };
}

function urlRewriter(file) {
  return reworkURL(function(url) {
    var abs = path.resolve(path.dirname(file.path), url);
    return abs.slice(process.cwd().length);
  });
}

function logError(err) {
  console.log('error', err, err.stack);
}

function copyTask(opts) {
  // Avoid using gulp for this because it is obscenely slow
  var pattern = opts.pattern;
  var excluding = opts.excluding;
  var to = opts.to;

  return function(cb) {
    glob(pattern, function(err, files) {
      if(err) throw err;
      files = files || [];

      var n = 0;
      files.forEach(function(file) {
        if(!excluding || excluding.test(file)) return;
        var dest = path.join(to, file);

        if(fs.statSync(file).isDirectory())
          mkdirp.sync(dest);
        else {
          n++;
          fs.createReadStream(file).pipe(fs.createWriteStream(dest))
          .on('close', function() {
            n--;
            if(n === 0) cb();
          });
        }
      });
    });
  };
}