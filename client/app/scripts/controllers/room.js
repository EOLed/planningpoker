'use strict';

angular.module('planningPokerApp')
  .controller('RoomCtrl', function ($scope, $http, $routeParams) {
    var onsuccess = function (data, status, headers, config) {
      $scope.room = data;
    };

    $http.get('/room/' + $routeParams.slug).success(onsuccess);
  });
