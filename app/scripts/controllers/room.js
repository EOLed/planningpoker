'use strict';

angular.module('planningPokerApp')
  .controller('RoomCtrl', function ($scope, $http, $routeParams, socket, userService) {
    var deck = { type: 'mountainGoat',
                 cards: [ { selected: false, display: '0', value: '0' },
                          { selected: false, display: '&frac12;', value: '.5' },
                          { selected: false, display: '1', value: '1' },
                          { selected: false, display: '2', value: '2' },
                          { selected: false, display: '3', value: '3' },
                          { selected: false, display: '5', value: '5' },
                          { selected: false, display: '8', value: '8' },
                          { selected: false, display: '13', value: '13' },
                          { selected: false, display: '20', value: '20' },
                          { selected: false, display: '40', value: '40' },
                          { selected: false, display: '100', value: '100' },
                          { selected: false, display: '?', value: '?' },
                          { selected: false,
                            display: '<img class="coffee" src="images/coffee.png" />',
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

    $scope.selectCard = function (card) {
      for (var i = 0; i < $scope.deck.cards.length; i++) {
        var cardInDeck = $scope.deck.cards[i];
        cardInDeck.selected = card.value === cardInDeck.value;
      }
    };

    $http.put('/room/join/' + $routeParams.slug, { user: userService.getUser() })
         .success(onsuccess);
  });
