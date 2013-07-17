'use strict';

angular.module('planningPokerApp')
  .controller('FindRoomCtrl', function ($scope, $http, $location, randomHexService, userService, socket) {
    socket.emit('connected', { user: userService.getUser() });
    $scope.slug = '';
    $scope.slugPattern = /^[0-9A-F]+$/;

    $scope.hostRoom = function () {
      var randomHex = randomHexService.generate(1000000);
      var onsuccess = function () { //data, status, headers, config) {
        $location.url('/room/' + randomHex);
      };

      $http.post('/room', { slug: randomHex, host: userService.getUser() }).success(onsuccess);
    };

    $scope.join = function (slug) {
      $location.url('/room/' + slug);
    };
  });
