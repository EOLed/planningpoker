'use strict';

angular.module('planningPokerApp')
  .service('randomHexService', function randomHexService() {
    var service = {
      generate: function (maxValue) {
        return (Math.random() * maxValue).toString(16);
      }
    };

    return service;
  });
