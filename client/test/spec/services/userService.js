/*globals sinon: false */
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
    var generate = sinon.stub(randomHexService, 'generate').returns('eeeeeee');
    var newUser = userService.getUser();
    expect(newUser).toEqual({ id: 'eeeeeee' });

    generate.reset();
  });

  it('should persist new user if none exists', function () {
    sinon.stub(localStorageService, 'get').withArgs('user').returns(null);
    spyOn(localStorageService, 'add');
    userService.getUser();
    expect(localStorageService.add.calls[0].args[0]).toEqual('user');
  });

  it('should return cached user if exists', function () {
    var cachedUser = { id: 'eeeeeeeeee', username: 'achan', name: 'Amos Chan' };
    sinon.stub(localStorageService, 'get').withArgs('user').returns(cachedUser);
    spyOn(localStorageService, 'add');
    var actualUser = userService.getUser();
    expect(localStorageService.add).not.toHaveBeenCalled();
    expect(actualUser).toEqual(cachedUser); 
  });
});
