'use strict';

angular.module('planningPokerApp')
  .service('randomHexService', function randomHexService() {
    var service = {
      generate: function (maxValue) {
        return parseInt((Math.random() * maxValue), 10).toString(16);
      }
    };

    return service;
  });
