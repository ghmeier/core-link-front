'use strict';
angular.module("corelink",["corelink.controllers", "ngRoute"])
.run(function($rootScope) {
      $rootScope.sleep = function(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds){
            break;
          }
        }
      };
  })
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/main.html'
    });
    $routeProvider.otherwise({redirectTo: '/home'});
}]);


