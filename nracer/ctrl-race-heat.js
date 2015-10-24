nracer.controller('RaceHeatCtrl', function ($scope, $location, $routeParams, RaceService) {
  var key = $routeParams.id;
  
  RaceService.ready().then(function () {
    $scope.race = RaceService.get_race(key);
    $scope.heat = parseInt($routeParams.heat);
    $scope.heati = $scope.heat - 1;
    $scope.heat_data = $scope.race.heats[$scope.heati];
    
    $scope.next_heat = $scope.heat + 1;
    $scope.prev_heat = $scope.heat - 1;
    
    if ($scope.next_heat > $scope.race.heats.length) {
      $scope.next_heat = null;
    }
    
    else {
      $scope.next_racers = [];
      var next_data = $scope.race.heats[$scope.heati + 1];
      for (var i=0; i < next_data.length; i++) {
        $scope.next_racers.push($scope.get_racer(next_data[i].racer));
      }
    }
    
    if ($scope.prev_heat <= 0) {
      $scope.prev_heat = null;
    }
  });
  
  $scope.get_racer = function (index) {
    return $scope.race.racers[index];
  };
  
  $scope.set_points = function (lane) {
    lane.points = 0;
    
    if (lane.result == '1') {
      lane.points = 9;
    }
    
    if (lane.result == '2') {
      lane.points = 6;
    }
    
    if (lane.result == '3') {
      lane.points = 3;
    }
    
    if (lane.result == '4') {
      lane.points = 1;
    }
    
    RaceService.calc_scores($scope.race);
    RaceService.save();
  };
  
  $scope.go_heat = function (h) {
    $location.url("/race/" + key + "/" + h);
  };
  
  $scope.see_results = function () {
    $location.url("/race/" + key + "/results");
  };
});
