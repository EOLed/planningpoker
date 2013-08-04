'use strict';

angular.module('planningPokerApp')
  .controller('FindRoomCtrl',
    function ($scope, $http, $location, $rootScope, randomHexService, userService, socket) {
      socket.emit('connected', { user: userService.getUser() });
      $scope.slug = '';
      $scope.slugPattern = /^[0-9A-F]+$/;
      $rootScope.title = 'Host your own online planning poker room!';

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
    }
  );
