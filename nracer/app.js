var nracer = angular.module('NRacer', ['ngMaterial', 'ngRoute']);

nracer.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/templates/welcome.html'
    })
    .when('/new-race', {
      controller: 'NewRaceCtrl',
      templateUrl: '/templates/new-race.html'
    })
    .when('/races', {
      controller: 'RaceListCtrl',
      templateUrl: '/templates/stored-races.html'
    })
    .when('/race/:id', {
      controller: 'RaceEditCtrl',
      templateUrl: '/templates/race-edit.html'
    })
    .when('/race/:id/:heat', {
      controller: 'RaceHeatCtrl',
      templateUrl: '/templates/race-heat.html'
    })
    .otherwise({redirectTo: '/'});
});