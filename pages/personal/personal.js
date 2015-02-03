/**
 * Modules
 */
require('angular');

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
require('./personal.scss');

/**
 * Main
 */
angular.module(name, [
  require('lib/slides')
])
.config(['slidesProvider', function(slides) {
  slides.register(name, {
    template: require('./personal.html'),
    controller: personalCtrl,
    controllerAs: 'Personal'
  });
}])
.controller('middleHobbies', middleHobbiesCtrl)


/**
 * Utilities
 */

function personalCtrl() {
  var vm = this;

  vm.card = 1;
  vm.next = next;
  vm.prev = prev;

  function next() {
    vm.card++;
  }

  function prev() {
    vm.card--;
  }

  

}

function middleHobbiesCtrl($scope) {

  var vm = this;
  vm.mediaHover = mediaHover;
  vm.clearHover = clearHover;
  vm.playWarcraft = playWarcraft;
  vm.playTJ = playTJ;

  function mediaHover(event, media) {
    event.stopPropagation();
    vm.hover = media;
  }

  function clearHover() {
    vm.hover = '';
    stopVideos();
  }

  function initVideos() {
    $('#warcraft-video')[0].currentTime = 122;
    $('#tj-video')[0].currentTime = 12*60 + 7;
  }

  function playWarcraft() {
    $('#warcraft-video')[0].play();
    $('#warcraft-video')[0].volume = 0;
  }

  function playTJ() {
    $('#tj-video')[0].play();
    $('#tj-video')[0].volume = 0;
  }

  function stopVideos() {
    $('#warcraft-video')[0].pause();
    $('#tj-video')[0].pause();
  }


  initVideos();

  $scope.Hobbies = this;
}