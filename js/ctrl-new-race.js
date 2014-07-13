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
  
  $scope.num_tracks = $scope.tracks[1];
  
  $scope.racers = [{name: 'P1', vehicle: 'V1'}, {name: 'P2', vehicle: 'V2'}];
  
  $scope.add_racer = function () {
    $scope.racers.push({name: 'PX', vehicle: 'PV'});
  };
  
  $scope.remove_racer = function (index) {
    $scope.racers.splice(index, 1);
  };
  
  $scope.create_race = function () {
    $rootScope.new_racers = $scope.racers
    $rootScope.new_tracks = $scope.num_tracks.name;
    
    $rootScope.load_race = 'new';
    $location.path('/start-race');
  };
});