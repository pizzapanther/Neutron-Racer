nracer.controller('AppCtrl', function ($scope, $location, WorkerService, NotifService) {
  $scope.version = '16.1.1';
  
  $scope.notif = NotifService.data;
  $scope.subscribe = function () {
    NotifService.subscribe($scope);
  };
  
  $scope.unsubscribe = function () {
    NotifService.unsubscribe($scope);
  };
  
  WorkerService.init_worker($scope);
  
  $scope.goto = function (url) {
    $location.url(url);
  };
});
