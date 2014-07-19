RaceApp.controller('WelcomeCtrl', function($scope, $rootScope) {
  $scope.app_name = $rootScope.manifest.name;
  $scope.version = $rootScope.manifest.version;
  
  $scope.windows = 0;
  $scope.win_id = chrome.app.window.current().id;
  
  $scope.new_window = function () {
    chrome.app.window.create('html/main.html', {
      resizable: true,
      id: "ndrive-main-" + $scope.windows,
      bounds: {
        width: 1024,
        height: 768
      }
    });
    
    $scope.windows += 1;
  };
});