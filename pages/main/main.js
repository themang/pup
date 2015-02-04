
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

  require('lib/slides'),
  require('pages/title'),
  require('pages/verse'),
  require('pages/personal'),
  require('pages/hello-world'),
  require('pages/dots'),
  require('pages/say-it'),
  require('pages/dots-sort'),
  require('pages/twitter')
])
.config(['$compileProvider', function($compileProvider) {
  var re = /^\s*(?:blob(?::|%3A))?(https?|ftp|file)(:|%3A)|data:image\//;
  $compileProvider.imgSrcSanitizationWhitelist(re);
}])
.directive('main', function() {
  return {
    template: require('./main.html'),
    controller: 'MainCtrl',
    controllerAs: 'Main',
    replace: true
  }
})
.config(['$routeProvider', 'slidesProvider', function($routeProvider, slides) {
  $routeProvider
    .otherwise({
      redirectTo: '/slide/1'
    });

  var order = ['title', 'personal', 'verse', 'hello-world', 'say-it', 'dots', 'dots-sort', 'twitter'];

  order.forEach(function(name, idx) {
    $routeProvider.when('/slide/' + (idx + 1), _.extend(slides.get(name), {name: name}));
  });


}])
.controller('MainCtrl', ['$element', '$location', '$rootScope', '$route', function($element, $location, $rootScope, $route) {
  var vm = this;
  $(window).on('keyup', function(evt) {
    if (evt.which === 39) {
      var url = $location.url().split('/');
      var idx = Number(url[2]);
      $location.url('/slide/' + (idx + 1));
      $rootScope.$apply();
    } else if (evt.which === 37) {
      var url = $location.url().split('/');
      var idx = Number(url[2]);
      $location.url('/slide/' + (idx - 1));
      $rootScope.$apply();
    }
  });

  $rootScope.$on('$routeChangeSuccess', function() {
    vm.name = $route.current.$$route.name;
  })
}]);


angular.element(document).ready(function() {
  var modules = ['main', require('lib/html5mode')];
  angular.bootstrap(document, modules);
});