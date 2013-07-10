'use strict';

angular.module('planningPokerApp')
  .controller('FindRoomCtrl', function ($scope, $http, $location, randomHexService) {
    $scope.hostRoom = function () {
      var randomHex = randomHexService.generate(1000000);
      var onsuccess = function (data, status, headers, config) {
        $location.url('/room/' + randomHex);
      };

      $http.post('/room', { slug: randomHex }).success(onsuccess);
    };
  });
