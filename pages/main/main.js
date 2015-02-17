
/**
 * Modules
 */
require('angular');
require('angular-material');
require('angular-animate');
require('angular-aria');
require('angular-sanitize');
require('angular-route');



var $ = require('jquery');
var _ = require('lodash');

/**
 * Relatives
 */
require('./main.scss');


/**
 * Exports
 */
var name = module.exports = 'main';


angular.module(name, [
  'ngMaterial',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',

])
.config(['$compileProvider', function($compileProvider) {
  var re = /^\s*(?:blob(?::|%3A))?(https?|ftp|file)(:|%3A)|data:image\//;
  $compileProvider.imgSrcSanitizationWhitelist(re);
}])
.directive('main', function() {
  return {
    template: require('./main.html'),
    controller: mainCtrl,
    controllerAs: 'Main',
    replace: true
  }
})


angular.element(document).ready(function() {
  var modules = ['main', require('lib/html5mode')];
  angular.bootstrap(document, modules);
});

function mainCtrl() {

}
