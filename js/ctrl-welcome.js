RaceApp.controller('WelcomeCtrl', function($scope, $rootScope) {
  $scope.app_name = $rootScope.manifest.name;
  $scope.version = $rootScope.manifest.version;
});