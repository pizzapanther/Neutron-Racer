nracer.controller('AppCtrl', function ($scope, $location) {
  $scope.version = '15.10.1';
  
  $scope.goto = function (url) {
    $location.url(url);
  };
});