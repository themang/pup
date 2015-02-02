/**
 * Modules
 */
require('angular');

/**
 * Exports
 */
var name = module.exports = require('./package.json').name;


angular.module(name, [])
.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}]);

