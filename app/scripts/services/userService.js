'use strict';

angular.module('planningPokerApp')
  .service('userService', [
  'localStorageService',
  'randomHexService',
  function (localStorageService, randomHexService) {
    var getRandomUserId = function () {
      return randomHexService.generate(10000000);
    };

    var defaultType = 'voter';
    var defaultStatus = { type: 'active' };

    var populateDefaultValues = function (user) {
      if (!user.type) {
        user.type = defaultType;
      }

      if (!user.status) {
        user.status = defaultStatus;
      }

      if (!user.id) {
        user.id = getRandomUserId();
      }

      return user;
    };

    var service = {
      getUser: function () {
        var user = localStorageService.get('user');
        if (user) {
          return populateDefaultValues(JSON.parse(user));
        }

        user = { id: getRandomUserId(),
                 type: 'voter',
                 status: { type: 'active' } };
        localStorageService.add('user', JSON.stringify(user));
        return user;
      }
    };

    return service;
  }
]);
