'use strict';
angular.module("corelink",["corelink.controllers", "ngRoute", "ui.bootstrap"])
.run(function($rootScope) {
    
    $rootScope.path = "http://localhost:3000"


    $rootScope.fleet = null;

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
        templateUrl: 'views/login.html'
    })
    .when('/fleet', {
        templateUrl: 'views/fleet.html'
    })
    .when('/planet', {
        templateUrl: 'views/planet.html'
    })
    .when('/user-error', {
        templateUrl: 'views/bad.html'
    });
    $routeProvider.otherwise({redirectTo: '/'});
}]);


