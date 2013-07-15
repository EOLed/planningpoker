/*global sinon: false, spyOn: false, describe: false, beforeEach: false, inject: false, it: false, expect: false*/
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
    var selectedRoom, currentUser;

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
    });

    it('should attach current room to scope', function () {
      RoomCtrl = createController();
      $httpBackend.flush();
      expect(scope.room).toEqual(selectedRoom);
    });

    it('should attach a deck of mountain goat cards to scope', function () {
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
      RoomCtrl = createController();
      $httpBackend.flush();
      expect(scope.deck).toEqual(deck);
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
