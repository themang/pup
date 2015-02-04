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
require('./twitter.scss');

/**
 * Main
 */
angular.module(name, [
  'ui.ace',
  require('lib/slides')
])
.config(['slidesProvider', function(slides) {
  slides.register(name, {
    template: require('./twitter.html'),
    controller: twitterCtrl,
    controllerAs: 'Tiwtter'
  });
}]);


/**
 * Utilities
 */
function twitterCtrl($scope) {

  var vm = this;

  $scope.editing = false;
  $scope.tweets = [];
  $scope.maxLength = 140;
  $scope.text = '';

  $scope.aceLoaded = function(editor) {
    editor.setFontSize(22);
    vm.editor = this;
    vm.session = editor.getSession();
    vm.session.setValue('');
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

  $scope.edit = function() {
    $scope.editing = true;
    setTimeout(function() {
      console.log('focus');
      $('.tweet-input').focus();
    });
  }

  $scope.stopPropagation = function(evt) {
    evt.stopPropagation();
  }

  $scope.postTweet = function() {
    if ($scope.text.length > $scope.maxLength) return;
    $scope.tweets.unshift($scope.text);
    $scope.text = '';
    $scope.editing = false;
  };

  $scope.setMaxLength = function(len) {
    $scope.maxLength = len;
  };
}