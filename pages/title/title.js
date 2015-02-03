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
angular.module(name, [
  require('lib/slides')
])
.config(['slidesProvider', function(slides) {
  slides.register(name, {
    template: require('./title.html'),
    controller: titleCtrl,
    controllerAs: 'Title'
  });
}]);


/**
 * Utilities
 */

function titleCtrl() {
  
}