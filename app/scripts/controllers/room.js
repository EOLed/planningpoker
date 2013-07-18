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

    var onCommit = function (data) {
      $scope.room = data.room;
    };

    var dispatchMessage = function (data) {
      if (data.type === 'join') {
        onJoin(data);
      } else if (data.type === 'joinAccepted') {
        onJoin(data);
      } else if (data.type === 'commit') {
        onCommit(data);
      }
    };

    $scope.selectCard = function (card) {
      for (var i = 0; i < $scope.deck.cards.length; i++) {
        var cardInDeck = $scope.deck.cards[i];
        cardInDeck.selected = card.value === cardInDeck.value;

        if (cardInDeck.selected) {
          $scope.userSelection = { value: cardInDeck.value, committed: false };
        }
      }
    };

    socket.forward('message', $scope);
    $scope.$on('socket:message', function (event, message) {
      if (message.slug !== $routeParams.slug) {
        return;
      }

      dispatchMessage(message);
    });

    $scope.commit = function () {
      for (var i = 0; i < $scope.room.users.length; i++) {
        var currentUser = $scope.room.users[i];
        if (currentUser.id === userService.getUser().id) {
          currentUser.status = 'committed';
          currentUser.value = $scope.userSelection.value;
          break;
        }
      }

      $scope.userSelection.committed = true;

      socket.emit('message',
                  { type: 'commit',
                    room: $scope.room,
                    user: userService.getUser(),
                    value: $scope.userSelection.value });
    };

    $scope.committed = false;

    socket.emit('message', { type: 'join', slug: $routeParams.slug, user: userService.getUser() });
  });
