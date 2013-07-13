'use strict';

angular.module('planningPokerApp')
  .controller('RoomCtrl', function ($scope, $http, $routeParams, socket, userService) {
    var onsuccess = function (data, status, headers, config) {
      var eventName = 'message ' + data.key;
      socket.forward(eventName, $scope);
      $scope.room = data;

      $scope.$on('socket:' + eventName, function (event, data) {
        console.log('message received: ' + JSON.stringify(data));
      });

      console.log('listening for event: ' + eventName);
    };

    $http.put('/room/join/' + $routeParams.slug, { user: userService.getUser() })
         .success(onsuccess);
  });
