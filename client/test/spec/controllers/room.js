/*global sinon: false, describe: false, beforeEach: false, inject: false, it: false, expect: false*/
'use strict';

describe('Controller: RoomCtrl', function () {
  var RoomCtrl, scope, $httpBackend, $routeParams, createController;

  // load the controller's module
  beforeEach(module('planningPokerApp'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector, $controller, $rootScope, _$httpBackend_, _$routeParams_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $routeParams = _$routeParams_;
    $routeParams.slug = 'e3421';
    createController = function () {
      return $controller('RoomCtrl', { $scope: scope });
    };
  }));

  describe('Backend running', function () {
    beforeEach(function () {
      var selectedRoom = { slug: 'e3421',
                           users: [{ username: 'achan', voter: true },
                                   { username: 'vsharma', voter: true },
                                   { username: 'drivet', voter: true },
                                   { username: 'paul', voter: false }] };

      $httpBackend.expectGET('/room/e3421').respond(200, selectedRoom);
      RoomCtrl = createController();
      $httpBackend.flush();
    });

    it('should attach current room to scope', function () {
      expect(scope.room.slug).toEqual('e3421');
      expect(scope.room.users.length).toEqual(4);
    });
  });
});
