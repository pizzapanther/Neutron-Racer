RaceApp.controller('NewRaceCtrl', function($scope, $rootScope, $location) {
  $scope.app_name = $rootScope.manifest.name;
  $scope.version = $rootScope.manifest.version;
  
  $scope.tracks = [
    {name: 2},
    {name: 3},
    {name: 4},
    {name: 5},
    {name: 6}
  ];
  
  $scope.error = '';
  $scope.num_tracks = $scope.tracks[1];
  
  $scope.racers = [{name: '', vehicle: ''}, {name: '', vehicle: ''}];
  
  $scope.add_racer = function () {
    $scope.racers.push({name: '', vehicle: ''});
  };
  
  $scope.remove_racer = function (index) {
    $scope.racers.splice(index, 1);
  };
  
  $scope.create_race = function () {
    var pattern = /^\s*$/;
    $scope.error = '';
    
    for (var i=0; i < $scope.racers.length; i++) {
      if (pattern.test($scope.racers[i].name)) {
        var count = i + 1;
        $scope.error = 'Each race needs a name. Racer ' + count + ' is missing a name.';
        return false;
      }
    }
    
    $rootScope.new_racers = $scope.racers;
    $rootScope.new_tracks = $scope.num_tracks.name;
    
    $rootScope.load_race = 'new';
    $location.path('/start-race');
  };
});