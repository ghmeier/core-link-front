angular.module('corelink.controllers').controller("PlanetController", function($rootScope, $scope, $location, HttpService){



	//If they arent logged in, log them in
	if($rootScope.username == "" || $rootScope.fleet.id == null ) {
		$location.path("/");
	} else {
		//Look at the plant the fleet is one
		
	}
});