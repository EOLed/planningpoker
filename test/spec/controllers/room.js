/*jshint camelcase: false*/
/*global spyOn: false, sinon: false, describe: false, beforeEach: false, inject: false, it: false, expect: false*/
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
        $routeParams.slug = 'dummyslug';
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
      currentUser = { id: 1234, username: 'achan', voter: true };
      sinon.stub(userService, 'getUser').returns(currentUser);
      selectedRoom = { slug: 'dummyslug',
                       users: [{ id: 1234, username: 'achan', voter: true },
                               { id: 42, username: 'vsharma', voter: true },
                               { id: 523, username: 'drivet', voter: true },
                               { id: 432432, username: 'paul', voter: false }] };

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

    it('should forward room specific socket calls to scope', function () {
      var mockSocket = sinon.mock(socket)
                            .expects('forward')
                            .withArgs('message', scope)
                            .once();
      RoomCtrl = createController();
      mockSocket.verify();
    });

    it('should send request to join current room', function () {
      var mockSocket = sinon.mock(socket)
                            .expects('emit')
                            .withArgs('message', { type: 'join', slug: 'dummyslug', user: currentUser })
                            .once();
      RoomCtrl = createController();
      mockSocket.verify();
    });

    describe('when successfully joined', function () {
      beforeEach(function () {
        RoomCtrl = createController();
        scope.$broadcast('socket:message', { type: 'joinAccepted',
                                             slug: 'dummyslug',
                                             room: selectedRoom });
      });

      it('should attach current room to scope', function () {
        expect(scope.room).toEqual(selectedRoom);
      });

      it('should filter out unsupported/irrelevant messages', function () {
        scope.$broadcast('socket:message', { type: 'thisiscrazy',
                                             slug: 'dummyslug',
                                             room: { crazyroom: 'whatonearth' } });
        expect(scope.room).toEqual(selectedRoom);
      });

      it('should filter out messages from other rooms', function () {
        scope.$broadcast('socket:message', { type: 'joinAccepted',
                                             slug: 'nobelongtoyou',
                                             room: { crazyroom: 'whatonearth' } });
        expect(scope.room).toEqual(selectedRoom);
      });

      it('should update scope.room when a new user has joined', function() {
        scope.$broadcast('socket:message', { type: 'join',
                                             slug: 'dummyslug',
                                             room: { mydata: 'test' } });
        expect(scope.room).toEqual({ mydata: 'test' });
      });

      it('should update scope.room when a user has committed estimate', function() {
        scope.$broadcast('socket:message', { type: 'commit',
                                             slug: 'dummyslug',
                                             room: { mydata: 'test' } });
        expect(scope.room).toEqual({ mydata: 'test' });
      });

      describe('committing estimate', function () {
        beforeEach(function () {
          spyOn(socket, 'emit');
          scope.userSelection = { display: '1', value: '1' };
          scope.commit();
        });

        it('should emit a message to the server', function () {
          expect(socket.emit).toHaveBeenCalledWith('message', { type: 'commit',
                                                                room: selectedRoom,
                                                                user: currentUser,
                                                                value: '1' });
        });

        it('should update local room with committed value', function () {
          var userInRoom;

          for (var i = 0; i < selectedRoom.users.length; i++) {
            if (selectedRoom.users[i].id === 1234) {
              userInRoom = selectedRoom.users[i];
              break;
            }
          }

          expect(userInRoom.value).toEqual('1');
          expect(userInRoom.status).toEqual('committed');
        });

        it('should set user selection as committed', function () {
          expect(scope.userSelection.committed).toBeTruthy();
        });
      });

      describe('Deck', function () {
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
          expect(scope.userSelection).toEqual({ value: '40', committed: false });
        });
      });
    });
  });
});
