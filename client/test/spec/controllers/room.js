/*global sinon: false, jasmine: false, describe: false, beforeEach: false, inject: false, it: false, expect: false*/
'use strict';

describe('Controller: RoomCtrl', function () {
  var mock, randomHexService, RoomCtrl, scope, $httpBackend, $location;

  // load the controller's module
  beforeEach(module('planningPokerApp'));

  beforeEach(function () {
    mock = { generate: function () { return 'e32d442'; } };

    module(function ($provide) {
      $provide.value('randomHexService', mock);
    });

    inject(function ($injector) {
      randomHexService = $injector.get('randomHexService');
    });
  });

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _randomHexService_, _$httpBackend_, _$location_) {
    scope = $rootScope.$new();
    RoomCtrl = $controller('RoomCtrl', { $scope: scope });
    $httpBackend = _$httpBackend_;
    randomHexService = _randomHexService_;
    $location = _$location_;
  }));

  describe('action: hostRoom', function () {
    it('should create new room with randomly generated hex string', function () {
      $httpBackend.expectPOST('/room', { slug: 'e32d442' }).respond(200, '');
      scope.hostRoom();
      $httpBackend.flush();
    });

    it('should change location to new room if room successfully created.', function () {
      $httpBackend.expectPOST('/room', { slug: 'e32d442' }).respond(200, '');
      scope.hostRoom();
      $httpBackend.flush();
      expect($location.url()).toBe('/room/e32d442');
    });
  });
});
