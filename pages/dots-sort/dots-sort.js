/**
 * Modules
 */
require('angular');
require('angular-ui-ace');

var $ = require('jquery');
var _ = require('lodash');

/**
 * Relatives
 */

/**
 * Exports
 */
var name = module.exports = require('./package.json').name;

/**
 * Styles
 */
require('./dots-sort.scss');

/**
 * Main
 */
angular.module(name, [
  'ui.ace',
  require('lib/slides')
])
.config(['slidesProvider', function(slides) {
  slides.register(name, {
    template: require('./dots-sort.html'),
    controller: dotsCtrl,
    controllerAs: 'Dots'
  });
}]);


/**
 * Utilities
 */
function dotsCtrl($scope) {

  var vm = this;

  var dots = ['red', 'orange', 'blue'];

  var idx = 0;
  $scope.dots = dots.map(function(dot) {
    return {color: dot, id: idx++};
  });

  var init = _.clone($scope.dots);

  $scope.size = "50px";
  $scope.width = '250px';

  $scope.aceLoaded = function(editor) {
    editor.setFontSize(20);
    vm.editor = this;
    vm.session = editor.getSession();
  }

  $scope.run = function() {
    try {
      with($scope) {
        eval(vm.session.getValue());
      }
    } catch (e) {
      throw e;
    }
    

  }

  $scope.reset = function() {
    console.log('reset', init);
    $scope.dots = _.clone(init);
  }

  $scope.aceChanged = function() {
    
  }

  $scope.isArray = function(obj) {
    return _.isArray(obj);
  }

  $scope.stopPropagation = function(evt) {
    evt.stopPropagation();
  }

  var colors = ['blue', 'red', 'orange', 'green'];
  $scope.addDot = function(color, times) {
    times = times || 1;
    _.times(times, function() {
      var c = color;
      if (color === 'random') {
        c = _.sample(colors);
      }
      $scope.dots.push({color: c, id: idx++});
    });
    
  }

  $scope.moveDot = function(idxFrom, idxTo) {
    var dot = $scope.dots.splice(idxFrom, 1)[0];
    $scope.dots.splice(idxTo, 0, dot);
  };
}
