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
      currentUser = { id: 1234, username: 'achan', type: 'voter', status: { type: 'active' } };
      sinon.stub(userService, 'getUser').returns(currentUser);
      selectedRoom = { slug: 'dummyslug',
                       host: currentUser,
                       users: [{ id: 1234,
                                 username: 'achan',
                                 type: 'voter',
                                 status: { type: 'active' } },
                               { id: 2321,
                                 username: 'vsharma',
                                 type: 'voter',
                                 status: { type: 'active' } },
                               { id: 29,
                                 username: 'drivet',
                                 type: 'voter',
                                 status: { type: 'active' } },
                               { id: 241,
                                 username: 'pcar',
                                 type: 'voter',
                                 status: { type: 'active' } } ] };

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
                          display: '<i class="icon-coffee"></i>',
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
                            .withArgs('message', { type: 'join',
                                                   slug: 'dummyslug',
                                                   user: currentUser })
                            .once();
      RoomCtrl = createController();
      mockSocket.verify();
    });

    describe('when joining room previously joined', function () {
      beforeEach(function () {
        selectedRoom.users[0].status = { type: 'committed', value: '1' };
        RoomCtrl = createController();
        scope.$broadcast('socket:message', { type: 'joinAccepted',
                                             slug: 'dummyslug',
                                             room: selectedRoom });
      });

      it('should update selected card from deck with values from scope', function () {
        expect(scope.deck.cards[2].selected).toBeTruthy();
      });

      it('should update user selection with values from scope', function () {
        expect(scope.userSelection).toEqual({ committed: true, value: '1' });
      });
    });

    describe('when determining whether the specified user is current user', function () {
      beforeEach(function () {
        RoomCtrl = createController();
      });
      it('should return true if user id matches', function () {
        expect(scope.isMe({ id: 1234, username: 'achan' })).toBeTruthy();
      });

      it('should return false if the user id doesn\'t match', function () {
        expect(scope.isMe({ id: '4321', username: 'achan' })).toBeFalsy();
      });
    });

    describe('when getting user display name', function () {
      it('should return the user\'s username if defined', function () {
        RoomCtrl = createController();
        var displayName = scope.getDisplayName({ id: '1234', username: 'achan' });
        expect(displayName).toEqual('achan');
      });

      it('should return the user\'s id if username undefined', function () {
        RoomCtrl = createController();
        var displayName = scope.getDisplayName({ id: '1234', wahtever: 'achan' });
        expect(displayName).toEqual('1234');
      });
    });

    describe('when querying if all committed', function () {
      it('should return true if all voters in room have committed', function () {
        var room  = { slug: 'dummyslug',
                      users: [{ id: 1234,
                                username: 'achan',
                                type: 'voter',
                                status: { type: 'committed', value: '1' } },
                              { id: 2412,
                                username: 'vsharma',
                                type: 'observer',
                                status: { type: 'active' } },
                              { id: 241,
                                username: 'pcar',
                                type: 'voter',
                                status: { type: 'committed', value: '2' } } ] };
        RoomCtrl = createController();
        scope.$broadcast('socket:message', { type: 'joinAccepted',
                                             slug: 'dummyslug',
                                             room: room });
        expect(scope.allCommitted()).toBeTruthy();
      });

      it('should return true if all voters in room have committed', function () {
        var room  = { slug: 'dummyslug',
                      users: [{ id: 1234,
                                username: 'achan',
                                type: 'voter',
                                status: { type: 'committed', value: '1' } },
                              { id: 241,
                                username: 'pcar',
                                type: 'voter',
                                status: { type: 'committed', value: '2' } } ] };
        RoomCtrl = createController();
        scope.$broadcast('socket:message', { type: 'joinAccepted',
                                             slug: 'dummyslug',
                                             room: room });
        expect(scope.allCommitted()).toBeTruthy();
      });

      it('should return false if all not voters in room have committed', function () {
        var room  = { slug: 'dummyslug',
                      users: [{ id: 1234,
                                username: 'achan',
                                type: 'voter',
                                status: { type: 'committed', value: '1' } },
                              { id: 241,
                                username: 'pcar',
                                type: 'voter',
                                status: { type: 'active' } } ] };
        RoomCtrl = createController();
        scope.$broadcast('socket:message', { type: 'joinAccepted',
                                             slug: 'dummyslug',
                                             room: room });
        expect(scope.allCommitted()).toBeFalsy();
      });
    });

    describe('when successfully joined', function () {
      beforeEach(function () {
        RoomCtrl = createController();
        scope.$broadcast('socket:message', { type: 'joinAccepted',
                                             slug: 'dummyslug',
                                             room: selectedRoom });
      });

      it('should initialize username to not editing', function () {
        expect(scope.state.isEditingUsername).toBeFalsy();
      });

      describe('when editing username', function () {
        it('should track when username is being edited', function () {
          scope.onUsernameClicked();
          expect(scope.state.isEditingUsername).toBeTruthy();
        });

        describe('when save clicked', function () {
          beforeEach(function () {
            spyOn(userService, 'setUsername');
            spyOn(socket, 'emit');
            scope.onUsernameClicked();
            scope.onSaveUser({ username: 'myusername' });
          });

          it('should track when username is no longer being edited', function () {
            expect(scope.state.isEditingUsername).toBeFalsy();
          });

          it('should persist username into userService', function () {
            expect(userService.setUsername).toHaveBeenCalledWith('myusername');
          });

          it('should emit a message to the server', function () {
            expect(socket.emit).toHaveBeenCalledWith('message', { type: 'nick',
                                                                  room: selectedRoom,
                                                                  user: { username: 'myusername' } });
          });
        });
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

      it('should update scope.room when a new user has joined', function () {
        scope.$broadcast('socket:message', { type: 'join',
                                             slug: 'dummyslug',
                                             room: { mydata: 'test' } });
        expect(scope.room).toEqual({ mydata: 'test' });
      });

      it('should update user when he changes username', function () {
        var me = { id: 1234, username: 'mynewusername', type: 'voter', status: { type: 'active' } };
        scope.$broadcast('socket:message', { type: 'nick', slug: 'dummyslug', user: me });
        expect(scope.room.users[0].username).toEqual('mynewusername');
      });

      it('should update scope.room when a user has committed estimate', function () {
        scope.$broadcast('socket:message', { type: 'commit',
                                             slug: 'dummyslug',
                                             room: { mydata: 'test' } });
        expect(scope.room).toEqual({ mydata: 'test' });
      });


      describe('when host restarts round', function () {
        var restartedRoom;
        beforeEach(function () {
          restartedRoom = { slug: 'dummyslug',
                            host: currentUser,
                            users: [{ id: 1234,
                                      username: 'achan',
                                      type: 'voter',
                                      status: { type: 'active' } },
                                    { id: 2321,
                                      username: 'vsharma',
                                      type: 'voter',
                                      status: { type: 'active' } },
                                    { id: 29,
                                      username: 'drivet',
                                      type: 'voter',
                                      status: { type: 'active' } }] };
          scope.selectCard({ value: '1' });
          scope.$broadcast('socket:message', { type: 'restart',
                                               slug: 'dummyslug',
                                               room: restartedRoom });
        });

        it('should update scope when the host invokes a round restart', function () {
          expect(scope.room).toEqual(restartedRoom);
        });

        it('should unselect every card', function () {
          for (var i = 0; i < scope.deck.cards.length; i++) {
            expect(scope.deck.cards[i].selected).toBeFalsy();
          }
        });

        it('should forget user selection', function () {
          expect(scope.userSelection).toBeUndefined();
        });
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

          expect(userInRoom.status).toEqual({ type: 'committed', value: '1' });
        });

        it('should set user selection as committed', function () {
          expect(scope.userSelection.committed).toBeTruthy();
        });

        it('should ignore card selection', function () {
          scope.selectCard({ value: '2' });
          expect(scope.userSelection.value).toEqual('1');
        });

      });

      describe('restarting poker round', function () {
        beforeEach(function () {
          spyOn(socket, 'emit');
        });

        it('should emit restart message through socket if you are host', function () {
          scope.restart();
          expect(socket.emit).toHaveBeenCalledWith('message', { type: 'restart',
                                                                room: selectedRoom });
        });

        it('should not emit restart message through socket if you are not host', function () {
          scope.room.host = { id: 'notyou' };
          scope.restart();
          expect(socket.emit).not.toHaveBeenCalled();
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
