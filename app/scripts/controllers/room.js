'use strict';

angular.module('planningPokerApp')
  .controller('RoomCtrl', function ($scope, $http, $routeParams, socket, userService) {
    var onJoin = function (data) {
      $scope.room = data.room;
    };

    var onsuccess = function (data) { //, status, headers, config) {
      var eventName = 'message ' + data.key;
      socket.forward(eventName, $scope);
      $scope.room = data;

      $scope.$on('socket:' + eventName, function (event, data) {
        if ( data.type === 'join') {
          onJoin(data);
        }
      });
    };

    $http.put('/room/join/' + $routeParams.slug, { user: userService.getUser() })
         .success(onsuccess);
  });
