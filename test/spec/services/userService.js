/*jshint camelcase: false*/
/*global sinon: false, spyOn: false, describe: false, beforeEach: false, inject: false, it: false, expect: false*/
'use strict';

describe('Service: userService', function () {
  var userService, localStorageService, randomHexService;

  // load the service's module
  beforeEach(module('planningPokerApp'));

  // instantiate service
  beforeEach(inject(function (_userService_, _localStorageService_, _randomHexService_) {
    userService = _userService_;
    localStorageService = _localStorageService_;
    randomHexService = _randomHexService_;
  }));

  it('should generate a new user id if none exists', function () {
    var localStorageGetStub = sinon.stub(localStorageService, 'get')
                                   .withArgs('user').returns(null);
    var generate = sinon.stub(randomHexService, 'generate').returns('eeeeeee');
    var newUser = userService.getUser();
    expect(newUser).toEqual({ id: 'eeeeeee',
                              type: 'voter',
                              status: { type: 'active' } });

    generate.reset();
    localStorageGetStub.reset();
  });

  it('should persist new user if none exists', function () {
    var localStorageGetStub = sinon.stub(localStorageService, 'get')
                                   .withArgs('user').returns(null);
    spyOn(localStorageService, 'add');
    userService.getUser();
    expect(localStorageService.add.calls[0].args[0]).toEqual('user');

    localStorageGetStub.reset();
  });

  it('should return cached user if exists', function () {
    var cachedUser = { id: 'eeeeeeeeee', type: 'notvoter', status: { type: 'active' } };
    var localStorageGetStub = sinon.stub(localStorageService, 'get')
                                   .withArgs('user')
                                   .returns(JSON.stringify(cachedUser));
    spyOn(localStorageService, 'add');
    var actualUser = userService.getUser();
    expect(localStorageService.add).not.toHaveBeenCalled();
    expect(actualUser).toEqual(cachedUser);

    localStorageGetStub.reset();
  });

  it('should enforce that local user has the required properties', function () {
    var generate = sinon.stub(randomHexService, 'generate').returns('eeeeeeeeee');
    var cachedUser = { username: 'achan', name: 'Amos Chan' };
    var localStorageGetStub = sinon.stub(localStorageService, 'get')
                                   .withArgs('user')
                                   .returns(JSON.stringify(cachedUser));
    spyOn(localStorageService, 'add');
    var actualUser = userService.getUser();
    expect(localStorageService.add).not.toHaveBeenCalled();
    expect(actualUser).toEqual({ id: 'eeeeeeeeee',
                                 username: 'achan',
                                 name: 'Amos Chan',
                                 type: 'voter',
                                 status: { type: 'active' } });

    localStorageGetStub.reset();
    generate.reset();
  });
});
