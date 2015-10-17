nracer.controller('RaceEditCtrl', function ($scope, $location, $routeParams, $mdToast, debounce, $mdDialog, RaceService) {
  var key = $routeParams.id;
  
  $scope.race = RaceService.get_race(key);
  if ($scope.race.calculated) {
    $location.url("/race/" + key + "/1");
  }
  
  $scope._save_race = function () {
    RaceService.save();
  };
  
  $scope.save_race = debounce($scope._save_race, 1000);
  
  $scope.add_racer = function () {
    $scope.race.racers.push({});
    $scope._save_race();
  };
  
  $scope.remove_racer = function (index, event) {
    var num = index + 1;
    var confirm = $mdDialog.confirm()
      .title('Confirm Delete')
      .content('Are you sure you wish to delete racer ' + num + '?')
      .ariaLabel('Confirm Delete')
      .targetEvent(event)
      .ok('Yes')
      .cancel('Cancel');
    
    $mdDialog.show(confirm).then(function() {
      $scope.race.racers.splice(index, 1);
      $scope._save_race();
    }, function() { });
  };
  
  $scope.test_racers = function (event) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/templates/dialog-test-racers.html',
      targetEvent: event,
      clickOutsideToClose:false
    })
    .then(function (num) {
      if (num) {
        num = parseInt(num);
        var racers = [];
        
        for (var i=0; i < num; i++) {
          var n = i + 1;
          var cnum = n + 100;
          
          racers.push({
            name: 'Racer ' + n,
            car_name: 'Car ' + n,
            num: cnum
          });
        }
        
        $scope.race.racers = racers;
        $scope._save_race();
      }
    }, function() {
      //cancelled
    });
  };
  
  $scope.calc_heats = function (event) {
    if ($scope.raceform.$valid) {
      var ret = RaceService.calc_heats($scope.race);
      
      if (ret == 'fail') {
        $mdDialog.show(
          $mdDialog.alert()
            .title('Calculation Error')
            .content('We can\'t find a race configuration that works, retry again or reduce your lane numbers.')
            .ariaLabel('Calculation Error')
            .ok('OK')
            .targetEvent(event)
        );
      }
      
      else {
        $location.url("/race/" + key + "/1");
      }
    }
    
    else {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Form Errors')
          .content('Please fix the errors in the form before proceeding.')
          .ariaLabel('Form Errors')
          .ok('OK')
          .targetEvent(event)
      );
    }
  };
});

function DialogController ($scope, $mdDialog) {
  $scope.testers = 2;
  
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  
  $scope.ok = function (testers) {
    $mdDialog.hide(testers);
  };
}
