/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');

/**
 * Middleware
 */
var serveFavicon = require('serve-favicon');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


/**
 * Exports
 */
var app = module.exports = express()


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(serveFavicon(path.resolve(__dirname + '/../favicon/favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());


app.get('*', function(req, res, next) {
  if(req.url === '/' || _.find(req.accepted, {value: 'text/html'})) {
    res.render('index', {
      title: 'Beauty of Code',
      config: require('lib/config')
    });
  } else
    next();
});