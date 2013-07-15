'use strict';

angular.module('planningPokerApp')
  .directive('card', function () {
    return {
      templateUrl: 'views/directives/card.html',
      replace: true,
      transclude: true,
      restrict: 'E',
      scope: {
        value: '@'
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
