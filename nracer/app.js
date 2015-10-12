var nracer = angular.module('NRacer', ['ngMaterial', 'ngRoute', 'debounce', 'ngMessages']);

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
    .when('/race/:id/results', {
      controller: 'RaceResultsCtrl',
      templateUrl: '/templates/race-results.html'
    })
    .when('/race/:id/:heat', {
      controller: 'RaceHeatCtrl',
      templateUrl: '/templates/race-heat.html'
    })
    .otherwise({redirectTo: '/'});
});

nracer.filter('numSuffix', function() {
  var suffixes = ["th", "st", "nd", "rd"];
  return function (num) {
    if (num) {
      num = num.toString();
      var last_num = num.charAt(num.length - 1);
      var ending = 'th';
      
      if (last_num == '1') {
        ending = 'st';
      }
      
      else if (last_num == '2') {
        ending = 'nd';
      }
      
      else if (last_num == '3') {
        ending = 'rd';
      }
      
      return num + ending;
    }
    
    return num;
  };
});