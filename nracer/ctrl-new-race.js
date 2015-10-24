nracer.controller('NewRaceCtrl', function ($scope, $location, RaceService) {
  RaceService.ready().then(function () {
    var key = RaceService.new_race();
    
    $location.url('/race/' + key);
  });
});
