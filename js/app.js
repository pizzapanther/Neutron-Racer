
var RaceApp = angular.module('race', ['ui.bootstrap']);

RaceApp.run(function ($rootScope, $modal) {
  $rootScope.manifest = chrome.runtime.getManifest();
});
