'use strict';

angular.module('planningPokerApp')
  .service('userService', [
  'localStorageService',
  'randomHexService',
  function (localStorageService, randomHexService) {
    var service = {
      getUser: function () {
        var user = localStorageService.get('user');
        if (user) {
          return user;
        }

        user = { id: randomHexService.generate(10000000) };
        localStorageService.add('user', user);
        return user;
      }
    };

    return service;
  }
]);
