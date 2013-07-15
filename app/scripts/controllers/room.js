'use strict';

angular.module('planningPokerApp')
  .controller('RoomCtrl', function ($scope, $http, $routeParams, socket, userService) {
    var deck = { type: 'mountainGoat',
                 cards: [ { display: '0', value: '0' },
                          { display: '&frac12;', value: '.5' },
                          { display: '1', value: '1' },
                          { display: '2', value: '2' },
                          { display: '3', value: '3' },
                          { display: '5', value: '5' },
                          { display: '8', value: '8' },
                          { display: '13', value: '13' },
                          { display: '20', value: '20' },
                          { display: '40', value: '40' },
                          { display: '100', value: '100' },
                          { display: '?', value: '?' },
                          { display: '<img class="coffee" src="images/coffee.png" />',
                            value: 'coffee' } ] };

    var onJoin = function (data) {
      $scope.room = data.room;
    };

    var onsuccess = function (data) { //, status, headers, config) {
      var eventName = 'message ' + data.key;
      socket.forward(eventName, $scope);
      $scope.room = data;
      $scope.deck = deck;

      $scope.$on('socket:' + eventName, function (event, data) {
        if ( data.type === 'join') {
          onJoin(data);
        }
      });
    };

    $http.put('/room/join/' + $routeParams.slug, { user: userService.getUser() })
         .success(onsuccess);
  });
