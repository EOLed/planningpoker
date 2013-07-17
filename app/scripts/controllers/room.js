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
      $scope.deck = deck;
    };

    $scope.selectCard = function (card) {
      for (var i = 0; i < $scope.deck.cards.length; i++) {
        var cardInDeck = $scope.deck.cards[i];
        cardInDeck.selected = card.value === cardInDeck.value;

        if (cardInDeck.selected) {
          $scope.userSelection = cardInDeck;
        }
      }
    };

    socket.forward('message', $scope);
    $scope.$on('socket:message', function (event, data) {
      if (data.slug !== $routeParams.slug) {
        return;
      }

      if (data.type === 'join') {
        onJoin(data);
      } else if (data.type === 'joinAccepted') {
        onJoin(data);
      }
    });

    // $scope.commit = function () {
    //   socket.emit('message ' + $scope.room.key,
    //               { type: 'commit',
    //                 room: $scope.room,
    //                 user: userService.getUser(),
    //                 value: $scope.userSelection.value });
    // };

    socket.emit('message', { type: 'join', slug: $routeParams.slug, user: userService.getUser() });
  });
