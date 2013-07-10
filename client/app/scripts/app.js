'use strict';

angular.module('planningPokerApp', [])
  .config(function ($routeProvider) {
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
  });
