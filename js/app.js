
var RaceApp = angular.module('race', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

RaceApp.config(function($routeProvider) {
  $routeProvider
    .when('/', {controller:'WelcomeCtrl', templateUrl:'welcome.html'})
    .when('/new-race', {controller:'NewRaceCtrl', templateUrl:'new-race.html'})
    .when('/start-race', {controller:'RaceCtrl', templateUrl:'race.html'})
    .otherwise({redirectTo: '/'});
});

RaceApp.run(function ($rootScope, $modal) {
  $rootScope.manifest = chrome.runtime.getManifest();
  
  $rootScope.reset = function () {
    $rootScope.new_racers = [];
    $rootScope.new_tracks = 2;
    $rootScope.load_race = '';
  };
  
  $rootScope.reset();
});
