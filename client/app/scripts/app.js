'use strict';

angular.module('planningPokerApp', ['LocalStorageModule', 'btford.socket-io'])
  .config(function ($routeProvider, socketProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/findRoom.html',
        controller: 'FindRoomCtrl'
      })
      .when('/room/:slug', {
        templateUrl: 'views/room.html',
        controller: 'RoomCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    socketProvider.prefix('pp');
  });
