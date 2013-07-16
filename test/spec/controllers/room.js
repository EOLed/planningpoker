/*global sinon: false, describe: false, beforeEach: false, inject: false, it: false, expect: false*/
'use strict';

describe('Controller: RoomCtrl', function () {
  var RoomCtrl, scope, $httpBackend, $routeParams, createController, socket, userService;

  // load the controller's module
  beforeEach(module('planningPokerApp'));

  // Initialize the controller and a mock scope
  beforeEach(
    inject(
      function ($injector, $controller, $rootScope, _$httpBackend_, _$routeParams_, _socket_,
                _userService_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        $routeParams = _$routeParams_;
        socket = _socket_;
        $routeParams.slug = 'e3421';
        userService = _userService_;
        createController = function () {
          return $controller('RoomCtrl', { $scope: scope });
        };
      }
    )
  );

  describe('Backend running', function () {
    var selectedRoom, currentUser, deck;

    beforeEach(function () {
      currentUser = { username: 'achan' };
      sinon.stub(userService, 'getUser').returns(currentUser);
      selectedRoom = { slug: 'e3421',
                       key: 'thisistheroomkey',
                       users: [{ username: 'achan', voter: true },
                               { username: 'vsharma', voter: true },
                               { username: 'drivet', voter: true },
                               { username: 'paul', voter: false }] };
      $httpBackend.expectPUT('/room/join/e3421', { user: currentUser }).respond(200, selectedRoom);
      deck = { type: 'mountainGoat',
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
    });

    it('should attach current room to scope', function () {
      RoomCtrl = createController();
      $httpBackend.flush();
      expect(scope.room).toEqual(selectedRoom);
    });

    it('should forward room specific socket calls to scope', function () {
      var mockSocket = sinon.mock(socket)
                            .expects('forward')
                            .withArgs('message thisistheroomkey', scope)
                            .once();
      RoomCtrl = createController();
      $httpBackend.flush();
      mockSocket.verify();
    });

    describe('Deck', function () {
      beforeEach(function () {
        RoomCtrl = createController();
        $httpBackend.flush();
      });

      it('should attach a deck of mountain goat cards to scope', function () {
        expect(scope.deck).toEqual(deck);
      });

      it('should only have one selected card at a time', function () {
        scope.selectCard({ display: '5', value: '5' });
        for (var i = 0; i < scope.deck.cards.length; i++) {
          var cardInDeck = scope.deck.cards[i];
          expect(cardInDeck.selected).toEqual( cardInDeck.value === '5');
        }
      });

      it('should store user selection in scope', function () {
        scope.selectCard({ display: '40', value: '40' });
        expect(scope.userSelection).toEqual({ selected: true, display: '40', value: '40' });
      });
    });

    describe('User has successfully joined room', function () {
      beforeEach(function () {
        RoomCtrl = createController();
        $httpBackend.flush();
      });

      it('should filter out unsupported/irrelevant messages', function () {
        // temporary functionality
        scope.$broadcast('socket:message thisistheroomkey', { test: 'data' });
        expect(scope.room).toEqual(selectedRoom);
      });

      it('should update scope.room when a new user has joined', function() {
        scope.$broadcast('socket:message thisistheroomkey', { type: 'join', room: { mydata: 'test' } });
        expect(scope.room).toEqual({ mydata: 'test' });
      });
    });
  });
});
