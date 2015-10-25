'use strict';
angular.module("corelink",["corelink.controllers", "ngRoute"])
.run(function($rootScope) {
    
    $rootScope.path = "http://localhost:3000"


    $rootScope.username = "";
    $rootScope.fleet = {
        id:null,
        ships: {},
        resources: {
            steel:0,
            copper:0,
            aluminium:0,
            water:0,
            protein:0,
            oil:0,
            coal:0,
            radioactive:0,
            dna:0,
            rare:0
        }
    };

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
    })
    .when('/user-error', {
        templateUrl: 'views/bad.html'
    });
    $routeProvider.otherwise({redirectTo: '/'});
}]);


