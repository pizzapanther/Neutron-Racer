nracer.controller('NewRaceCtrl', function ($scope, $location, RaceService) {
  var key = RaceService.new_race();
  
  $location.url('/race/' + key);
});
