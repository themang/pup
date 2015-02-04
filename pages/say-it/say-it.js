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
require('./say-it.scss');

/**
 * Main
 */
angular.module(name, [
  'ui.ace',
  require('lib/slides')
])
.config(['slidesProvider', function(slides) {
  slides.register(name, {
    template: require('./say-it.html'),
    controller: sayItCtrl,
    controllerAs: 'SayIt'
  });
}]);


/**
 * Utilities
 */
function sayItCtrl($scope) {

  var vm = this;

  $('#slide').on('keyup', function(evt) {
    
  })

  $scope.jkLoaded = function(editor) {
    editor.setFontSize(14);
    editor.getSession().setTabSize(2);
  }

  $scope.aceLoaded = function(editor) {
    editor.setFontSize(22);
    vm.editor = this;
    vm.session = editor.getSession();
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

  $scope.mumbleMore = function mumbleMore(pensieve, wormword, muggleBile, squib) {
    var spells = {
      engorgio: function(fn) {
        return fn.bind(muggleBile, wormword ? pensieve.concat(wormword):[pensieve]);
      },
      accio: function(squib) {
        $scope.text = pensieve.join(' ');
        return $scope.text;
      }
    };
    return spells[(wormword || pensieve.split) ? 'engorgio' : 'accio'](mumbleMore);
  };

  $scope.sayIt = function(firstWord) {
    var words = [];
    return (function sayIt(word) {
      if (!word) {
        $scope.text = words.join(' ');
        return $scope.text;
      } else {
        words.push(word);
        return sayIt;
      }
    })(firstWord);
  } 
}



