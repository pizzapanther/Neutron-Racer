nracer.controller('RaceListCtrl', function ($scope, $mdDialog, $location, RaceService) {
  
  RaceService.ready().then(function () {
    $scope.races = RaceService.races;
  });
  
  $scope.remove_race = function (key, event) {
    var name = $scope.races[key].name || "Race " + $scope.races[key].date;
    
    var confirm = $mdDialog.confirm()
      .title('Confirm Delete')
      .content('Are you sure you wish to delete ' + name + '?')
      .ariaLabel('Confirm Delete')
      .targetEvent(event)
      .ok('Yes')
      .cancel('Cancel');
    
    $mdDialog.show(confirm).then(function() {
      RaceService.remove(key);
    }, function() { });
  };
  
  $scope.go_to_race = function (key) {
    $location.url('/race/' + key);
  };
});
