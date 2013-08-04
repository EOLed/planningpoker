'use strict';

angular.module('planningPokerApp')
  .controller('RoomCtrl', function ($rootScope, $scope, $http, $routeParams, socket, userService) {
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
                            display: '<i class="icon-coffee"></i>',
                            value: 'coffee' } ] };

    var isMe = function (user) {
      return user.id === userService.getUser().id;
    };


    var onJoin = function (data) {
      $scope.room = data.room;
      $scope.deck = deck;
    };

    var onJoinAccepted = function (data) {
      onJoin(data);

      var userInRoom = getUserInRoom(userService.getUser().id);
      if (userInRoom.status.type === 'committed') {
        var selectedCardValue = userInRoom.status.value;
        getCardInDeck(selectedCardValue).selected = true;
        $scope.userSelection = { committed: true, value: selectedCardValue };
      }
    };

    var onCommit = function (data) {
      $scope.room = data.room;
    };

    var onRestart = function (data) {
      $scope.room = data.room;
      resetDeck();
      $scope.userSelection = undefined;
    };

    var onNicknameChange = function (data) {
      var user = getUserInRoom(data.user.id);
      user.username = data.user.username;
    };

    var resetDeck = function () {
      for (var i = 0; i < $scope.deck.cards.length; i++) {
        $scope.deck.cards[i].selected = false;
      }
    };

    var getUserInRoom = function (userId) {
      for (var i = 0; i < $scope.room.users.length; i++) {
        var currentUser = $scope.room.users[i];
        if (currentUser.id === userId) {
          return currentUser;
        }
      }
    };

    var getCardInDeck = function (value) {
      for (var i = 0; i < $scope.deck.cards.length; i++) {
        var cardInDeck = $scope.deck.cards[i];
        if (cardInDeck.value === value) {
          return cardInDeck;
        }
      }
    };

    var dispatchMessage = function (data) {
      if (data.type === 'join') {
        onJoin(data);
      } else if (data.type === 'joinAccepted') {
        onJoinAccepted(data);
      } else if (data.type === 'commit') {
        onCommit(data);
      } else if (data.type === 'restart') {
        onRestart(data);
      } else if (data.type === 'nick') {
        onNicknameChange(data);
      }
    };

    $scope.state = { isEditingUsername: false };

    $scope.selectCard = function (card) {
      if ($scope.userSelection && $scope.userSelection.committed) {
        return;
      }

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
      var user = getUserInRoom(userService.getUser().id);
      user.status.type = 'committed';
      user.status.value = $scope.userSelection.value;

      $scope.userSelection.committed = true;

      socket.emit('message', { type: 'commit',
                               room: $scope.room,
                               user: userService.getUser(),
                               value: $scope.userSelection.value });
    };

    $scope.allCommitted = function () {
      for (var i = 0; i < $scope.room.users.length; i++) {
        var currentUser = $scope.room.users[i];
        if (currentUser.type === 'voter' && currentUser.status.type !== 'committed') {
          return false;
        }
      }

      return true;
    };

    $scope.restart = function () {
      if ($scope.isHost()) {
        socket.emit('message', { type: 'restart', room: $scope.room });
      }
    };

    $scope.isHost = function () {
      return $scope.room && $scope.room.host.id === userService.getUser().id;
    };

    $scope.getDisplayName = function (user) {
      return user.username ? user.username : user.id;
    };

    $scope.isMe = isMe;

    $scope.onUsernameClicked = function (user) {
      if (isMe(user)) {
        $scope.state.isEditingUsername = true;
      }
    };

    $scope.onCancelSaveUser = function () {
      var currentUser = userService.getUser();
      getUserInRoom(currentUser.id).username = currentUser.username;
      $scope.state.isEditingUsername = false;
    };

    $scope.onSaveUser = function (user) {
      userService.setUsername(user.username);
      $scope.state.isEditingUsername = false;

      socket.emit('message', { type: 'nick', room: $scope.room, user: user } );
    };

    $rootScope.title = 'Planning Poker Room #' + $routeParams.slug;

    socket.emit('message', { type: 'join', slug: $routeParams.slug, user: userService.getUser() });
  });
