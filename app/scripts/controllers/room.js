'use strict';

angular.module('planningPokerApp')
  .controller('RoomCtrl', function ($scope, $http, $routeParams, socket, userService) {
    var onsuccess = function (data, status, headers, config) {
      $scope.room = data;
    };

    $http.put('/room/join/' + $routeParams.slug, { user: userService.getUser() }).success(onsuccess);
  });
