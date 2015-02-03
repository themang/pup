/**
 * Modules
 */
require('angular');

/**
 * Relatives
 */

/**
 * Exports
 */
var name = module.exports = require('./package.json').name;

/**
 * Main
 */
angular.module(name, [])
.provider('slides', [function() {
  var slides = {};

  this.register = function(name, slide) {
    slides[name] = slide;
  };

  this.get = function(name) {
    return slides[name];
  }

  this.$get = function() {
    return slides;
  };
}])


/**
 * Utilities
 */