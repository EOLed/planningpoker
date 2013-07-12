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
    beforeEach(function () {
      var currentUser = { username: 'achan' };
      sinon.stub(userService, 'getUser').returns(currentUser);
      var selectedRoom = { slug: 'e3421',
                           users: [{ username: 'achan', voter: true },
                                   { username: 'vsharma', voter: true },
                                   { username: 'drivet', voter: true },
                                   { username: 'paul', voter: false }] };

      $httpBackend.expectPUT('/room/join/e3421', { user: currentUser }).respond(200, selectedRoom);
      RoomCtrl = createController();
      $httpBackend.flush();
    });

    it('should attach current room to scope', function () {
      expect(scope.room.slug).toEqual('e3421');
      expect(scope.room.users.length).toEqual(4);
    });
  });
});
