nracer.controller('RaceResultsCtrl', function ($scope, $location, $routeParams, RaceService) {
  var key = $routeParams.id;
  $scope.key = key;
  
  RaceService.ready().then(function () {
    $scope.race = RaceService.get_race(key);
    
    var completed = RaceService.calc_scores($scope.race);
    $scope.race.completed = completed;
    RaceService.save();
    
    $scope.scores = [];
    
    for (var i=0; i < $scope.race.racers.length; i++) {
      var index = $scope.scores.indexOf($scope.race.racers[i].score);
      
      if (index < 0) {
        $scope.scores.push($scope.race.racers[i].score);
      }
    }
    
    $scope.scores = $scope.scores.sort().reverse();
  });
  
  $scope.get_racer = function (index) {
    return $scope.race.racers[index];
  };
  
  $scope.place = function (score) {
    return $scope.scores.indexOf(score) + 1;
  };
  
  $scope.print = function () {
    window.print();
  };
  
  $scope.go_back = function () {
    $location.url("/race/" + key + "/" + $scope.race.heats.length);
  };
});
