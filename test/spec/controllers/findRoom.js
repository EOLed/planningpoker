/*jshint camelcase: false*/
/*global sinon: false, describe: false, beforeEach: false, inject: false, it: false, expect: false*/
'use strict';

describe('Controller: FindRoomCtrl', function () {
  var randomHexService, FindRoomCtrl, scope, $httpBackend, $location, userService;

  // load the controller's module
  beforeEach(module('planningPokerApp'));

  // Initialize the controller and a mock scope
  beforeEach(
    inject(
      function ($controller, $rootScope, _randomHexService_, _$httpBackend_, _$location_,
                _userService_) {
        scope = $rootScope.$new();
        FindRoomCtrl = $controller('FindRoomCtrl', { $scope: scope });
        $httpBackend = _$httpBackend_;
        randomHexService = _randomHexService_;
        userService = _userService_;
        $location = _$location_;
      }
    )
  );

  describe('action: join', function () {
    it('should change location to the room specified', function () {
      scope.join('f345dc');
      expect($location.url()).toBe('/room/f345dc');
    });
  });

  describe('action: hostRoom', function () {
    it('should create new room with randomly generated hex string and the current user', function () {
      var getUserStub = sinon.stub(userService, 'getUser').returns({ id: 'thisismyid' });
      var generateStub = sinon.stub(randomHexService, 'generate').returns('e32d442');
      $httpBackend.expectPOST('/room', { slug: 'e32d442', host: { id: 'thisismyid' } }).respond(200, '');
      scope.hostRoom();
      $httpBackend.flush();

      getUserStub.reset();
      generateStub.reset();
    });

    it('should change location to new room if room successfully created.', function () {
      var generateStub = sinon.stub(randomHexService, 'generate').returns('e32d442');
      $httpBackend.expectPOST('/room').respond(200, '');
      scope.hostRoom();
      $httpBackend.flush();
      expect($location.url()).toBe('/room/e32d442');
      generateStub.reset();
    });
  });
});
