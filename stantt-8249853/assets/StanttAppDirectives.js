// DIRECTIVES
var StanttAppDirectives = angular.module('StanttAppDirectives', []);

StanttAppDirectives.directive('highlightMe', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        $timeout(function() {
          element[0].select();
        }, 50, false);
      }
    };
  });
