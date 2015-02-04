/**
 * Modules
 */
require('angular');
require('angular-ui-ace');

var $ = require('jquery');

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
require('./hello-world.scss');

/**
 * Main
 */
angular.module(name, [
  'ui.ace',
  require('lib/slides')
])
.config(['slidesProvider', function(slides) {
  slides.register(name, {
    template: require('./hello-world.html'),
    controller: helloWorldCtrl,
    controllerAs: 'Hello'
  });
}]);


/**
 * Utilities
 */
function helloWorldCtrl($scope) {

  var vm = this;

  $('#slide').on('keyup', function(evt) {
    
  })

  $scope.aceLoaded = function(editor) {
    editor.setFontSize(22);
    vm.editor = this;
    vm.session = editor.getSession();
    vm.session.setValue('text = "";\ncolor = "black";\n')
  }



  $scope.aceChanged = function() {
    $scope.text = '';
    $scope.color = 'black';
    with($scope) {
      try {
        eval(vm.session.getValue());
      } catch (e) {

      }
      
    }
  }

  $scope.stopPropagation = function(evt) {
    evt.stopPropagation();
  }
}