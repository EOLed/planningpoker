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
          return JSON.parse(user);
        }

        user = { id: randomHexService.generate(10000000) };
        localStorageService.add('user', JSON.stringify(user));
        return user;
      }
    };

    return service;
  }
]);
