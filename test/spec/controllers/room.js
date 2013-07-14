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

    it('should forward room specific socket calls to scope', function () {
      var mockSocket = sinon.mock(socket)
                            .expects('forward')
                            .withArgs('message thisistheroomkey', scope)
                            .once();
      RoomCtrl = createController();
      $httpBackend.flush();
      mockSocket.verify();
    });

    it('should listen for room specific socket events broadcasted to scope', function () {
      // temporary functionality

      RoomCtrl = createController();
      $httpBackend.flush();

      spyOn(console, 'log');
      scope.$broadcast('socket:message thisistheroomkey', { test: 'data' });
      expect(console.log).toHaveBeenCalledWith('message received: {"test":"data"}');
    });
  });
});
