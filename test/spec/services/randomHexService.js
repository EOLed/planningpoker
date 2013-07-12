'use strict';

describe('Service: randomHexService', function () {
  beforeEach(module('planningPokerApp'));

  var randomHexService;
  beforeEach(inject(function (_randomHexService_) {
    randomHexService = _randomHexService_;
  }));

  it('should generate a random hex string', function () {
    var actualHex = randomHexService.generate(1000);
    expect(typeof actualHex).toEqual('string');
  });

  it('should generate a random hex string <= max value', function () {
    var actualHex;
    for (var i = 0; i < 100; i++) {
      actualHex = randomHexService.generate(32);
      expect(parseInt(actualHex, 16)).toBeLessThan(32);
    }
  });
});
