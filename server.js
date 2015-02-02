/**
 * Module dependencies.
 */
var express = require('express')
var http = require('http');

/**
 * exports
 */
var app = module.exports = express();

var re = /\/[^\?]+\.(gif|jpg|jpeg|png|ico|tiff|bmp|css|woff|ttf|eot|svg)/;

app.use('/lib', function(req, res, next) {
  re.test(req.url) ? next() : res.send(403);
});
app.use(express.static(__dirname + '/public'));
app.use(require('lib/boot'));
app.set('port', process.env.PORT || 3000);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
  process.send && process.send('listening');
});